"use client";

import { useParams } from "next/navigation";
import { VideoPlayer } from "@/shared/video-player/VideoPlayer";


// Cloudinary adaptive streaming: append sp_auto and change extension to .m3u8 (HLS)
// Shaka Player will pick up multiple quality tracks automatically
const CLOUDINARY_HLS =
  "https://res.cloudinary.com/dgsfeis7x/video/upload/sp_auto/v1769999430/uploads/yfhx58pwpsoywx7lcrzf.m3u8";

const continueData = [
  {
    id: 1,
    title: "Advanced React Patterns",
    description: "Aprende patrones avanzados de React usados en producción.",
    duration: "45 mins",
    videoUrl: CLOUDINARY_HLS,
    seasonName: "Season 1 - React",
    chapterName: "Hooks avanzados",
    episodeNumber: 1,
  },
  {
    id: 2,
    title: "TypeScript Essentials",
    description: "Domina TypeScript desde cero.",
    duration: "30 mins",
    videoUrl: CLOUDINARY_HLS,
    seasonName: "Season 1 - TypeScript",
    chapterName: "Tipos básicos",
    episodeNumber: 2,
  },
];

export default function CoursePlayerPage() {
  const params = useParams();
  const id = Number(params.id);

  const course = continueData.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="p-6 text-white">
        <h2 className="text-xl"> Curso no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/*  VIDEO PLAYER */}
      <VideoPlayer
        videoUrl={course.videoUrl}
        title={course.title}
        description={course.description}
        seasonName={course.seasonName}
        chapterName={course.chapterName}
        episodeNumber={course.episodeNumber}
        storageKey={`course-${course.id}`}
        onProgressUpdate={(progress, time) => {
          console.log("Progress:", progress, "Time:", time);
        }}
      />

      {/* INFO DEL CURSO */}
      <div className="text-white space-y-2">
        <h1 className="text-2xl font-bold">{course.title}</h1>

        <p className="text-white/70">
          {course.description}
        </p>

        <div className="text-sm text-white/50 flex gap-4">
          <span> {course.duration}</span>
          <span> {course.seasonName}</span>
          <span> {course.chapterName}</span>
        </div>
      </div>
    </div>
  );
}