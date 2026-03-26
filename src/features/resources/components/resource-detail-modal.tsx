'use client';
import React from "react";
import { X, Download, Eye, Star, Calendar, User, Tag, FileText, Video, ClipboardList, ExternalLink } from "lucide-react";
import type { Resource } from "@/types/resource.types";

type ResourceDetailModalProps = {
  resource: Resource;
  onClose: () => void;
  onDownload?: () => void;
  onRate?: (rating: number) => void;
};

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  onClose,
  onDownload,
  onRate,
}) => {
  const [selectedRating, setSelectedRating] = React.useState<number>(0);

  const getResourceIcon = () => {
    switch (resource.resourceType) {
      case "PDF":
        return <FileText className="h-6 w-6" />;
      case "Video":
        return <Video className="h-6 w-6" />;
      case "Exercise":
        return <ClipboardList className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    onRate?.(rating);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-gray-900/95 backdrop-blur-xl">
        {/* Header with Thumbnail */}
        <div className="relative h-64 w-full overflow-hidden">
          {resource.thumbnailUrl ? (
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <div className="text-white/40">{getResourceIcon()}</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg bg-black/40 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Resource Type Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              {getResourceIcon()}
              {resource.resourceType}
            </div>
            
            {resource.difficultyLevel && (
              <div className={`rounded-full border px-3 py-1.5 text-sm font-semibold backdrop-blur-sm ${getDifficultyColor()}`}>
                {resource.difficultyLevel}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h1 className="mb-3 text-3xl font-bold text-white">{resource.title}</h1>

          {/* Genres */}
          <div className="mb-4 flex flex-wrap gap-2">
            {resource.genre.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Stats Row */}
          <div className="mb-6 flex flex-wrap items-center gap-4 border-y border-white/[0.08] py-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Eye className="h-4 w-4" />
              <span>{resource.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Download className="h-4 w-4" />
              <span>{resource.downloads.toLocaleString()} downloads</span>
            </div>
            {resource.rating && (
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span>{resource.rating.toFixed(1)} ({resource.ratingCount} ratings)</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(resource.publishedAt || resource.createdAt)}</span>
            </div>
          </div>

          {/* Author Info */}
          <div className="mb-6 flex items-center gap-3">
            {resource.authorAvatar ? (
              <img
                src={resource.authorAvatar}
                alt={resource.authorName}
                className="h-12 w-12 rounded-full border-2 border-white/10"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/10 bg-white/5">
                <User className="h-6 w-6 text-white/40" />
              </div>
            )}
            <div>
              <p className="text-sm text-white/50">Created by</p>
              <p className="font-semibold text-white">{resource.authorName}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Description</h2>
            <p className="text-white/70 leading-relaxed">{resource.description}</p>
          </div>

          {/* Resource Specific Details */}
          {resource.resourceType === 'PDF' && resource.fileSize && (
            <div className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">File Information</h3>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>Size: {formatFileSize(resource.fileSize)}</span>
                <span>Format: PDF</span>
              </div>
            </div>
          )}

          {resource.resourceType === 'Video' && resource.videoDuration && (
            <div className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">Video Information</h3>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>Duration: {resource.videoDuration}</span>
                {resource.youtubeUrl && (
                  <a
                    href={resource.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-red-400 hover:text-red-300"
                  >
                    Watch on YouTube
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {resource.resourceType === 'Exercise' && resource.exercise && (
            <div className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">Exercise Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                <span>Questions: {resource.exercise.questions.length}</span>
                {resource.exercise.timeLimit && <span>Time Limit: {resource.exercise.timeLimit} min</span>}
                {resource.exercise.totalPoints && <span>Total Points: {resource.exercise.totalPoints}</span>}
                {resource.exercise.passingScore && <span>Passing Score: {resource.exercise.passingScore}%</span>}
              </div>
            </div>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                <Tag className="h-5 w-5" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rate This Resource */}
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-white">Rate This Resource</h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating <= selectedRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {resource.resourceType === 'PDF' && (
              <button
                onClick={onDownload}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600"
              >
                <Download className="mr-2 inline-block h-5 w-5" />
                Download PDF
              </button>
            )}
            
            {resource.resourceType === 'Video' && resource.youtubeUrl && (
              <a
                href={resource.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 text-center font-semibold text-white transition-all hover:from-red-600 hover:to-pink-600"
              >
                <Video className="mr-2 inline-block h-5 w-5" />
                Watch Video
              </a>
            )}
            
            {resource.resourceType === 'Exercise' && (
              <button
                onClick={() => {/* Navigate to exercise page */}}
                className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600"
              >
                <ClipboardList className="mr-2 inline-block h-5 w-5" />
                Start Exercise
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal;
