'use client';
import React, { useMemo, useState } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import type { ResourceType, GenreType, DifficultyLevel, SortBy } from "@/types/resource.types";

type ResourceFiltersProps = {
  onFiltersChange: (filters: {
    search: string;
    genres: GenreType[];
    resourceTypes: ResourceType[];
    difficultyLevels: DifficultyLevel[];
    sortBy: SortBy;
  }) => void;
};

const GENRES: GenreType[] = [
  'Programming',
  'Music',
  'Audio Engineering',
  'Business',
  'Languages',
  'Design',
  'Marketing',
  'Science',
  'Mathematics',
  'Arts',
];

const RESOURCE_TYPES: ResourceType[] = ['PDF', 'Video', 'Exercise'];

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Title (A-Z)' },
];

const ResourceFilters: React.FC<ResourceFiltersProps> = ({ onFiltersChange }) => {
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<GenreType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = useMemo(() => {
    return selectedGenres.length + selectedTypes.length + selectedDifficulty.length;
  }, [selectedGenres, selectedTypes, selectedDifficulty]);

  const applyFilters = () => {
    onFiltersChange({
      search,
      genres: selectedGenres,
      resourceTypes: selectedTypes,
      difficultyLevels: selectedDifficulty,
      sortBy,
    });
  };

  React.useEffect(() => {
    applyFilters();
  }, [search, selectedGenres, selectedTypes, selectedDifficulty, sortBy]);

  const toggleGenre = (genre: GenreType) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleType = (type: ResourceType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleDifficulty = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty]
    );
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedGenres([]);
    setSelectedTypes([]);
    setSelectedDifficulty([]);
    setSortBy('recent');
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search resources by title, tags, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/[0.06] focus:outline-none"
          />
        </div>

        {/* Filter Toggle & Sort */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/[0.14] hover:bg-white/[0.07]"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-4 pr-10 text-sm text-white backdrop-blur-sm transition-all hover:border-white/[0.14] hover:bg-white/[0.07] focus:border-blue-500/50 focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Filter Resources</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-400 transition-colors hover:text-blue-300"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-5">
            {/* Genre Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-white/70">Genre</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedGenres.includes(genre)
                        ? 'bg-blue-500 text-white'
                        : 'border border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/[0.14] hover:bg-white/[0.07]'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Resource Type Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-white/70">Resource Type</label>
              <div className="flex flex-wrap gap-2">
                {RESOURCE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedTypes.includes(type)
                        ? 'bg-purple-500 text-white'
                        : 'border border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/[0.14] hover:bg-white/[0.07]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-white/70">Difficulty Level</label>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTY_LEVELS.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => toggleDifficulty(difficulty)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedDifficulty.includes(difficulty)
                        ? 'bg-green-500 text-white'
                        : 'border border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/[0.14] hover:bg-white/[0.07]'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/50">Active filters:</span>
          {selectedGenres.map((genre) => (
            <span
              key={genre}
              className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-400"
            >
              {genre}
              <button onClick={() => toggleGenre(genre)} className="hover:text-blue-300">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedTypes.map((type) => (
            <span
              key={type}
              className="flex items-center gap-1.5 rounded-full bg-purple-500/20 px-2.5 py-1 text-xs font-medium text-purple-400"
            >
              {type}
              <button onClick={() => toggleType(type)} className="hover:text-purple-300">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedDifficulty.map((difficulty) => (
            <span
              key={difficulty}
              className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400"
            >
              {difficulty}
              <button onClick={() => toggleDifficulty(difficulty)} className="hover:text-green-300">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceFilters;
