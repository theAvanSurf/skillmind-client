"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Spinner } from "@/shared/ui/spinner";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
  seasonName?: string;
  chapterName?: string;
  episodeNumber?: number;
  onProgressUpdate?: (progress: number, currentTime: number) => void;
}

export function VideoPlayer({
  videoUrl,
  title,
  description,
  seasonName,
  chapterName,
  episodeNumber,
  onProgressUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [showControls, setShowControls] = useState(true);

  // PLAY / PAUSE
  const handlePlayPause = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (!isPlaying) {
        await videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    } catch {
      setError("No se pudo reproducir el video");
    }
  }, [isPlaying]);

  // SKIP
  const handleSkip = useCallback(
    (seconds: number) => {
      if (!videoRef.current) return;

      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + seconds)
      );
    },
    [duration]
  );

  // VOLUME
  const handleVolumeChange = useCallback((v: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
  }, []);

  const handleToggleMute = useCallback(() => {
    handleVolumeChange(isMuted ? 1 : 0);
  }, [isMuted, handleVolumeChange]);

  // SEEK
  const handleSeek = useCallback((time: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // METADATA
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
    setIsLoading(false);
  }, []);

  // TIME UPDATE
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    if (onProgressUpdate && duration) {
      const progress = (time / duration) * 100;
      onProgressUpdate(progress, time);
    }
  }, [duration, onProgressUpdate]);

  // STATES
  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handlePause = () => setIsPlaying(false);
  const handlePlaying = () => setIsBuffering(false);
  const handleWaiting = () => setIsBuffering(true);

  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleEnded = () => {
    setIsCompleted(true);
    setIsPlaying(false);
  };

  const handleError = () => {
    setError("Error al cargar el video");
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleRetry = () => {
    if (!videoRef.current) return;

    setError(null);
    videoRef.current.load();
  };

  // AUTO HIDE CONTROLS
  const handleMouseMove = useCallback(() => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // KEYBOARD
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      }
      if (e.code === "ArrowRight") handleSkip(10);
      if (e.code === "ArrowLeft") handleSkip(-10);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePlayPause, handleSkip]);

  // SAVE PROGRESS
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        localStorage.setItem(
          "video-progress",
          videoRef.current.currentTime.toString()
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // RESUME
  useEffect(() => {
    const saved = localStorage.getItem("video-progress");
    if (saved && videoRef.current) {
      videoRef.current.currentTime = Number(saved);
    }
  }, []);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";

    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration
    ? (currentTime / duration) * 100
    : 0;

  return (
    <div
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        preload="auto"
        src={videoUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onPlaying={handlePlaying}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        onError={handleError}
      />

      {/* LOADING ANIMADO */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Spinner className="w-10 h-10" />
      </div>

      {/* BUFFER */}
      {isBuffering && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Spinner className="w-8 h-8" />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <p className="text-white mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-white text-black px-4 py-2 rounded"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <p className="text-white text-lg">Video completado 🎉</p>
        </div>
      )}

      {/* INFO OVERLAY */}
      {showControls && (
        <div className="absolute top-0 left-0 p-4 text-white space-y-1">
          <h2 className="text-lg font-bold">{title}</h2>
          {description && (
            <p className="text-sm opacity-80">{description}</p>
          )}
          {seasonName && (
            <p className="text-xs opacity-70">
              {seasonName} • Episode {episodeNumber} • {chapterName}
            </p>
          )}
        </div>
      )}

      {/* CONTROLES */}
      <div
        className={`absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-1 bg-gray-600 mb-3 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            handleSeek(percent * duration);
          }}
        >
          <div
            className="h-1 bg-red-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <button onClick={handlePlayPause}>
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <button onClick={() => handleSkip(-10)}>
              <SkipBack />
            </button>

            <button onClick={() => handleSkip(10)}>
              <SkipForward />
            </button>

            <button onClick={handleToggleMute}>
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) =>
                handleVolumeChange(Number(e.target.value))
              }
            />
          </div>

          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}