'use client';
import { useState, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import ResourceFilters from "@/features/resources/components/resource-filters";
import ResourceGrid from "@/features/resources/components/resource-grid";
import ResourceStats from "@/features/resources/components/resource-stats";
import ResourceUploadForm from "@/features/resources/components/resource-upload-form";
import ResourceDetailModal from "@/features/resources/components/resource-detail-modal";
import { mockResources } from "./mock-data";
import type { Resource, GenreType, ResourceType, DifficultyLevel, SortBy, CreateResourceDTO } from "@/types/resource.types";

export default function ResourcesPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [filters, setFilters] = useState<{
    search: string;
    genres: GenreType[];
    resourceTypes: ResourceType[];
    difficultyLevels: DifficultyLevel[];
    sortBy: SortBy;
  }>({
    search: '',
    genres: [],
    resourceTypes: [],
    difficultyLevels: [],
    sortBy: 'recent',
  });

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = [...mockResources];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.authorName.toLowerCase().includes(searchLower) ||
          resource.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Genre filter
    if (filters.genres.length > 0) {
      filtered = filtered.filter((resource) =>
        filters.genres.some((genre) => resource.genre.includes(genre))
      );
    }

    // Resource type filter
    if (filters.resourceTypes.length > 0) {
      filtered = filtered.filter((resource) =>
        filters.resourceTypes.includes(resource.resourceType)
      );
    }

    // Difficulty filter
    if (filters.difficultyLevels.length > 0) {
      filtered = filtered.filter(
        (resource) =>
          resource.difficultyLevel && filters.difficultyLevels.includes(resource.difficultyLevel)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [filters]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: mockResources.length,
      pdf: mockResources.filter((r) => r.resourceType === 'PDF').length,
      video: mockResources.filter((r) => r.resourceType === 'Video').length,
      exercise: mockResources.filter((r) => r.resourceType === 'Exercise').length,
    };
  }, []);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const handleResourceClick = useCallback((resource: Resource) => {
    setSelectedResource(resource);
  }, []);

  const handleDownload = useCallback(() => {
    if (selectedResource) {
      // TODO: Implement actual download logic
      console.log('Downloading resource:', selectedResource.id);
      alert(`Downloading: ${selectedResource.title}`);
    }
  }, [selectedResource]);

  const handleRate = useCallback((rating: number) => {
    if (selectedResource) {
      // TODO: Implement actual rating API call
      console.log('Rating resource:', selectedResource.id, 'with', rating, 'stars');
      alert(`You rated "${selectedResource.title}" ${rating} stars!`);
    }
  }, [selectedResource]);

  const handleUploadSubmit = async (data: CreateResourceDTO) => {
    // TODO: Implement actual API call
    console.log('Upload data:', data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Close form and show success message
    setShowUploadForm(false);
    
    // TODO: Show success toast/notification
    alert('Resource published successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-400">Learning Hub</p>
          <h1 className="text-3xl font-semibold text-white">Community Resources</h1>
          <p className="text-sm text-white/40">
            Explore and share educational resources with the community
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="h-5 w-5" />
          Publish Resource
        </button>
      </header>

      {/* Stats */}
      <ResourceStats
        totalResources={stats.total}
        pdfCount={stats.pdf}
        videoCount={stats.video}
        exerciseCount={stats.exercise}
      />

      {/* Filters */}
      <ResourceFilters onFiltersChange={handleFiltersChange} />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">
          Showing <span className="font-semibold text-white">{filteredResources.length}</span> of{' '}
          <span className="font-semibold text-white">{stats.total}</span> resources
        </p>
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onDownload={handleDownload}
          onRate={handleRate}
        />
      )}

      {/* Resources Grid */}
      <ResourceGrid
        resources={filteredResources}
        onResourceClick={handleResourceClick}
        emptyStateMessage="No resources match your filters"
      />

      {/* Upload Form Modal */}
      {showUploadForm && (
        <ResourceUploadForm
          onSubmit={handleUploadSubmit}
          onCancel={() => setShowUploadForm(false)}
        />
      )}
    </div>
  );
}
