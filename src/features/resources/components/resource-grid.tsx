import React from "react";
import ResourceCard from "./resource-card";
import type { Resource } from "@/types/resource.types";

type ResourceGridProps = {
  resources: Resource[];
  onResourceClick?: (resource: Resource) => void;
  emptyStateMessage?: string;
};

const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  onResourceClick,
  emptyStateMessage = "No resources found",
}) => {
  if (resources.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-3 text-4xl">📚</div>
          <h3 className="mb-1 text-lg font-semibold text-white">{emptyStateMessage}</h3>
          <p className="text-sm text-white/40">Try adjusting your filters or search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onClick={() => onResourceClick?.(resource)}
        />
      ))}
    </div>
  );
};

export default ResourceGrid;
