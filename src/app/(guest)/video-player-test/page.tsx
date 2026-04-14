"use client";

import { useMemo, useState } from "react";
import { VideoPlayer } from "@/shared/video-player/VideoPlayer";

const CLOUDINARY_HLS =
  "https://res.cloudinary.com/dgsfeis7x/video/upload/sp_auto/v1769999430/uploads/yfhx58pwpsoywx7lcrzf.m3u8";

const CLOUDINARY_MPD =
  "https://res.cloudinary.com/dgsfeis7x/video/upload/sp_auto/v1776202850/uploads/lwnrr4tmkscacmiahldh.mpd";

const TEST_ITEMS = [
  {
    id: 1,
    title: "Video Player Test: MPD (DASH)",
    description: "Testing the MPD URL to debug 423 / loading issues.",
    seasonName: "QA Season",
    chapterName: "DASH Playback",
    episodeNumber: 1,
    videoUrl: CLOUDINARY_MPD,
  },
  {
    id: 2,
    title: "Video Player Test: HLS",
    description: "Known-working HLS stream for comparison.",
    seasonName: "QA Season",
    chapterName: "HLS Playback",
    episodeNumber: 2,
    videoUrl: CLOUDINARY_HLS,
  },
] as const;

export default function VideoPlayerTestPage() {
  const [selectedId, setSelectedId] = useState<number>(1);

  const selected = useMemo(
    () => TEST_ITEMS.find((item) => item.id === selectedId) ?? TEST_ITEMS[0],
    [selectedId]
  );

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-sm backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Public QA Route
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Video Player Test Bench
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Use this page to test playback, seeking, volume, fullscreen, quality changes, and resume state without logging in.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {TEST_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                item.id === selectedId
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-sky-300"
              }`}
            >
              Scenario {item.id}
            </button>
          ))}
        </div>
      </header>

      <VideoPlayer
        videoUrl={selected.videoUrl}
        title={selected.title}
        description={selected.description}
        seasonName={selected.seasonName}
        chapterName={selected.chapterName}
        episodeNumber={selected.episodeNumber}
        storageKey={`video-player-test-${selected.id}`}
        onProgressUpdate={(progress, time) => {
          console.log("[VideoPlayerTest]", { scenario: selected.id, progress, time });
        }}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold">Checklist</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Play/Pause works and no console playback errors.</li>
          <li>Seek bar updates current time and resumes from seek point.</li>
          <li>Quality selector appears and switches levels.</li>
          <li>Volume, mute, and fullscreen controls behave correctly.</li>
          <li>Refresh page and confirm progress resumes from stored position.</li>
        </ul>
      </div>
    </section>
  );
}
