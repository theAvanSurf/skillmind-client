import React from "react";
import { FileText, Video, ClipboardList, Download, Eye, Star, Clock, User } from "lucide-react";
import type { Resource } from "@/types/resource.types";

type ResourceCardProps = {
  resource: Resource;
  onClick?: () => void;
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  const getResourceIcon = () => {
    switch (resource.resourceType) {
      case "PDF":
        return <FileText className="h-5 w-5" />;
      case "Video":
        return <Video className="h-5 w-5" />;
      case "Exercise":
        return <ClipboardList className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = () => {
    switch (resource.difficultyLevel) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Expert":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07]"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Resource Thumbnail */}
      <div className="relative h-40 w-full overflow-hidden bg-white/[0.06]">
        {resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt={resource.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <div className="text-white/40">{getResourceIcon()}</div>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Resource Type Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          <span className="text-white/70">{getResourceIcon()}</span>
          {resource.resourceType}
        </div>

        {/* Difficulty Badge */}
        {resource.difficultyLevel && (
          <div className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm ${getDifficultyColor()}`}>
            {resource.difficultyLevel}
          </div>
        )}
      </div>

      {/* Resource Info */}
      <div className="p-4">
        {/* Genres */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {resource.genre.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400"
            >
              {genre}
            </span>
          ))}
          {resource.genre.length > 2 && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
              +{resource.genre.length - 2}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-sm font-semibold leading-snug text-white line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="mb-3 text-xs text-white/50 line-clamp-2">
          {resource.description}
        </p>

        {/* Author */}
        <div className="mb-3 flex items-center gap-2">
          {resource.authorAvatar ? (
            <img
              src={resource.authorAvatar}
              alt={resource.authorName}
              className="h-5 w-5 rounded-full border border-white/10"
            />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <User className="h-3 w-3 text-white/40" />
            </div>
          )}
          <span className="text-[11px] text-white/60">{resource.authorName}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-3 text-[11px] text-white/35">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {resource.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {resource.downloads.toLocaleString()}
            </span>
            {resource.rating && (
              <span className="flex items-center gap-1 text-yellow-400">
                <Star className="h-3.5 w-3.5 fill-current" />
                {resource.rating.toFixed(1)}
              </span>
            )}
          </div>
          
          {resource.fileSize && (
            <span className="text-[10px] text-white/30">
              {formatFileSize(resource.fileSize)}
            </span>
          )}
          {resource.videoDuration && (
            <span className="flex items-center gap-1 text-[10px] text-white/30">
              <Clock className="h-3 w-3" />
              {resource.videoDuration}
            </span>
          )}
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
