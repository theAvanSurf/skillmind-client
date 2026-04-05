"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Spinner } from "@/shared/ui/spinner";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlayerState =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "buffering"
  | "error"
  | "ended";

interface QualityTrack {
  id: number;
  height: number | null;
  bandwidth: number;
}

export interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
  seasonName?: string;
  chapterName?: string;
  episodeNumber?: number;
  /** Called on timeupdate with (progress%, currentTime) */
  onProgressUpdate?: (progress: number, currentTime: number) => void;
  /** Called when playback ends */
  onEnded?: () => void;
  /** localStorage key for resume. Defaults to videoUrl. */
  storageKey?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_PREFIX = "vp:";
const CONTROLS_HIDE_MS = 3_000;
const SAVE_INTERVAL_MS = 5_000;

let shakaModulePromise: Promise<typeof import("shaka-player")> | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAdaptiveUrl(url: string): boolean {
  return /\.(mpd|m3u8)(\?|$)/i.test(url);
}

function canUseNativeHls(url: string): boolean {
  if (typeof window === "undefined") return false;
  if (!/\.m3u8(\?|$)/i.test(url)) return false;
  const video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegurl") !== "";
}

async function loadShakaModule() {
  if (!shakaModulePromise) {
    shakaModulePromise = import("shaka-player");
  }
  return shakaModulePromise;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoPlayer({
  videoUrl,
  title,
  description,
  seasonName,
  chapterName,
  episodeNumber,
  onProgressUpdate,
  onEnded,
  storageKey,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shakaRef = useRef<any>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── State ──────────────────────────────────────────────────────────────────
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qualityTracks, setQualityTracks] = useState<QualityTrack[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [initKey, setInitKey] = useState(0); // bumped to force Shaka re-init on retry

  // ── Derived ────────────────────────────────────────────────────────────────
  const nativeHls = useMemo(() => canUseNativeHls(videoUrl), [videoUrl]);
  const adaptive = useMemo(
    () => isAdaptiveUrl(videoUrl) && !nativeHls,
    [videoUrl, nativeHls]
  );

  const progressKey = useMemo(
    () => `${STORAGE_PREFIX}${storageKey ?? videoUrl}`,
    [storageKey, videoUrl]
  );

  const progressPct = useMemo(
    () => (duration > 0 ? (currentTime / duration) * 100 : 0),
    [currentTime, duration]
  );

  const isPlaying = playerState === "playing";
  const showSpinner =
    (playerState === "idle" ||
      playerState === "loading" ||
      playerState === "buffering") &&
    !error;

  useEffect(() => {
    if (!adaptive) return;
    void loadShakaModule();
  }, [adaptive]);

  // ── Shaka init / teardown ──────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!adaptive) {
      // Native path — video src set via JSX prop, just reset state
      setQualityTracks([]);
      setSelectedQuality(null);
      setPlayerState("loading");
      return;
    }

    let cancelled = false;

    const init = async () => {
      // Destroy any existing Shaka instance
      if (shakaRef.current) {
        await shakaRef.current.destroy();
        shakaRef.current = null;
      }

      setError(null);
      setQualityTracks([]);
      setSelectedQuality(null);
      setPlayerState("loading");

      const mod = await loadShakaModule();
      if (cancelled) return;

      const shaka = mod.default;
      shaka.polyfill.installAll();

      if (!shaka.Player.isBrowserSupported()) {
        setError("Your browser does not support adaptive video streaming.");
        setPlayerState("error");
        return;
      }

      const player = new shaka.Player();
      player.configure({
        streaming: {
          bufferingGoal: 10,
          rebufferingGoal: 2,
          bufferBehind: 30,
        },
      });

      await player.attach(video);
      shakaRef.current = player;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      player.addEventListener("error", (e: any) => {
        if (cancelled) return;
        console.error("[Shaka] Error:", e.detail);
        setError("A streaming error occurred. Please try again.");
        setPlayerState("error");
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      player.addEventListener("buffering", (e: any) => {
        if (cancelled) return;
        if (e.buffering) {
          setPlayerState("buffering");
        } else {
          setPlayerState(video.paused ? "ready" : "playing");
        }
      });

      try {
        await player.load(videoUrl);
        if (cancelled) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tracks: any[] = player.getVariantTracks();
        const unique = tracks
          .filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (t, i, arr) => arr.findIndex((x: any) => x.height === t.height) === i
          )
          .sort((a, b) => (b.height ?? 0) - (a.height ?? 0));

        setQualityTracks(
          unique.map((t) => ({ id: t.id, height: t.height, bandwidth: t.bandwidth }))
        );
      } catch (err) {
        if (cancelled) return;
        console.error("[Shaka] Load failed:", err);
        setError("Could not load the video stream. Please check the URL.");
        setPlayerState("error");
      }
    };

    init();

    return () => {
      cancelled = true;
      if (shakaRef.current) {
        shakaRef.current.destroy();
        shakaRef.current = null;
      }
    };
  }, [videoUrl, adaptive, initKey]);

  // ── Fullscreen sync ────────────────────────────────────────────────────────
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // ── Periodic progress save ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const t = videoRef.current?.currentTime;
      if (t != null && t > 0) localStorage.setItem(progressKey, String(t));
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPlaying, progressKey]);

  // ── Controls auto-hide ─────────────────────────────────────────────────────
  const scheduleHide = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, CONTROLS_HIDE_MS);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  // ── Playback controls ──────────────────────────────────────────────────────
  const handlePlayPause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (err) {
      console.error("[VideoPlayer] play/pause failed:", err);
    }
  }, []);

  const handleSkip = useCallback((secs: number) => {
    const video = videoRef.current;
    if (!video || !isFinite(video.duration)) return;
    video.currentTime = Math.max(
      0,
      Math.min(video.duration, video.currentTime + secs)
    );
  }, []);

  const handleVolumeChange = useCallback((val: number) => {
    const video = videoRef.current;
    if (!video) return;
    const v = Math.max(0, Math.min(1, val));
    video.volume = v;
    if (video.muted && v > 0) video.muted = false;
    setVolume(v);
    setIsMuted(v === 0);
  }, []);

  const handleToggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    if (adaptive) {
      setInitKey((k) => k + 1);
    } else {
      setPlayerState("loading");
      videoRef.current?.load();
    }
  }, [adaptive]);

  const handleSelectQuality = useCallback(
    (trackId: number | null) => {
      const p = shakaRef.current;
      if (!p) return;
      if (trackId === null) {
        p.configure({ abr: { enabled: true } });
        setSelectedQuality(null);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tracks: any[] = p.getVariantTracks();
        const track = tracks.find((t) => t.id === trackId);
        if (!track) return;
        p.configure({ abr: { enabled: false } });
        p.selectVariantTrack(track, true);
        setSelectedQuality(trackId);
      }
      setShowQualityMenu(false);
    },
    []
  );

  // ── Video element event handlers ───────────────────────────────────────────
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setPlayerState("ready");

    const saved = localStorage.getItem(progressKey);
    if (saved) {
      const t = parseFloat(saved);
      if (isFinite(t) && t > 0 && t < video.duration - 2) {
        video.currentTime = t;
      }
    }
  }, [progressKey]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    const d = video.duration;
    setCurrentTime(t);
    if (onProgressUpdate && d > 0) {
      onProgressUpdate((t / d) * 100, t);
    }
  }, [onProgressUpdate]);

  const handleCanPlay = useCallback(() => {
    setError(null);
    setPlayerState((prev) =>
      prev === "idle" || prev === "loading" ? "ready" : prev
    );
  }, []);

  const handlePlay = useCallback(() => setPlayerState("playing"), []);

  const handlePause = useCallback(
    () => setPlayerState((prev) => (prev !== "ended" ? "ready" : prev)),
    []
  );

  const handleWaiting = useCallback(() => setPlayerState("buffering"), []);

  const handlePlaying = useCallback(() => setPlayerState("playing"), []);

  const handleEnded = useCallback(() => {
    setPlayerState("ended");
    localStorage.removeItem(progressKey);
    onEnded?.();
  }, [onEnded, progressKey]);

  const handleVideoError = useCallback(() => {
    setError("Failed to load the video.");
    setPlayerState("error");
  }, []);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowRight":
          handleSkip(10);
          break;
        case "ArrowLeft":
          handleSkip(-10);
          break;
        case "KeyM":
          handleToggleMute();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlePlayPause, handleSkip, handleToggleMute, toggleFullscreen]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black overflow-hidden select-none ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none"
          : "aspect-video rounded-xl"
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* ── Video element ── */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
        src={adaptive ? undefined : videoUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onEnded={handleEnded}
        onError={handleVideoError}
        onClick={handlePlayPause}
      />

      {/* ── Loading / buffering spinner ── */}
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none transition-opacity duration-200">
          <Spinner size={52} />
        </div>
      )}

      {/* ── Error overlay ── */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 gap-5 p-6 text-center">
          <AlertCircle className="text-red-500" size={52} />
          <p className="text-white text-sm max-w-xs leading-relaxed">{error}</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 bg-white text-black font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* ── Ended overlay ── */}
      {playerState === "ended" && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
          <div className="text-center space-y-4">
            <p className="text-white text-2xl font-bold tracking-tight">
              Chapter Complete
            </p>
            <button
              onClick={() => {
                handleSeek(0);
                handlePlayPause();
              }}
              className="flex items-center gap-2 mx-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              <RotateCcw size={15} />
              Replay
            </button>
          </div>
        </div>
      )}

      {/* ── Top gradient + course info ── */}
      <div
        className={`absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-4 space-y-0.5">
          <h2 className="text-white font-bold text-sm leading-snug line-clamp-1">
            {title}
          </h2>
          {description && (
            <p className="text-white/60 text-xs line-clamp-1">{description}</p>
          )}
          {seasonName && (
            <p className="text-white/40 text-xs">
              {seasonName}
              {episodeNumber != null && ` · Ep. ${episodeNumber}`}
              {chapterName && ` · ${chapterName}`}
            </p>
          )}
        </div>
      </div>

      {/* ── Bottom controls ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pt-12 pb-4 px-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <SeekBar
          currentTime={currentTime}
          duration={duration}
          progressPct={progressPct}
          onSeek={handleSeek}
        />

        <div className="flex items-center justify-between text-white mt-2">
          {/* Left controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="hover:text-white/70 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={28} fill="white" />
              ) : (
                <Play size={28} fill="white" />
              )}
            </button>

            <button
              onClick={() => handleSkip(-10)}
              className="hover:text-white/70 transition-colors"
              aria-label="Rewind 10 seconds"
            >
              <SkipBack size={22} />
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="hover:text-white/70 transition-colors"
              aria-label="Forward 10 seconds"
            >
              <SkipForward size={22} />
            </button>

            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
            />

            <span className="text-xs text-white/70 tabular-nums hidden sm:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {adaptive && qualityTracks.length > 0 && (
              <QualityMenu
                tracks={qualityTracks}
                selectedId={selectedQuality}
                open={showQualityMenu}
                onToggle={() => setShowQualityMenu((p) => !p)}
                onSelect={handleSelectQuality}
              />
            )}

            <button
              onClick={toggleFullscreen}
              className="hover:text-white/70 transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SeekBarProps {
  currentTime: number;
  duration: number;
  progressPct: number;
  onSeek: (time: number) => void;
}

function SeekBar({ currentTime, duration, progressPct, onSeek }: SeekBarProps) {
  return (
    <div className="group/seek relative w-full h-5 flex items-center cursor-pointer">
      {/* Track */}
      <div className="absolute w-full h-1 bg-white/25 rounded-full group-hover/seek:h-1.25 transition-all pointer-events-none">
        <div
          className="h-full bg-red-500 rounded-full relative"
          style={{ width: `${progressPct}%` }}
        >
          {/* Thumb */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow scale-0 group-hover/seek:scale-100 transition-transform" />
        </div>
      </div>
      {/* Invisible range for interaction */}
      <input
        type="range"
        min={0}
        max={duration || 100}
        step={0.25}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
        aria-label="Video progress"
      />
    </div>
  );
}

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
}

function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-1 group/vol">
      <button
        onClick={onToggleMute}
        className="hover:text-white/70 transition-colors"
        aria-label="Toggle mute"
      >
        {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </button>
      <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-[width] duration-200">
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-20 h-1 accent-white cursor-pointer"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}

interface QualityMenuProps {
  tracks: QualityTrack[];
  selectedId: number | null;
  open: boolean;
  onToggle: () => void;
  onSelect: (id: number | null) => void;
}

function QualityMenu({
  tracks,
  selectedId,
  open,
  onToggle,
  onSelect,
}: QualityMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="hover:text-white/70 transition-colors"
        aria-label="Quality settings"
        aria-expanded={open}
      >
        <Settings size={20} />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-3 bg-black/95 backdrop-blur-sm border border-white/10 rounded-xl p-3 min-w-32.5 shadow-2xl z-50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 px-1">
            Quality
          </p>
          <button
            onClick={() => onSelect(null)}
            className={`block w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
              selectedId === null
                ? "bg-red-500/20 text-red-400 font-semibold"
                : "text-white hover:bg-white/10"
            }`}
          >
            Auto
          </button>
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`block w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                selectedId === t.id
                  ? "bg-red-500/20 text-red-400 font-semibold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {t.height ? `${t.height}p` : "Auto"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
