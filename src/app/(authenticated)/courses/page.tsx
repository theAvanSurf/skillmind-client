"use client"

import {
  useState, useEffect, useRef, useCallback, KeyboardEvent,
} from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import {
  Search, X, BookOpen, Tag, Grid3X3,
  ChevronDown, Sparkles, SlidersHorizontal,
} from "lucide-react"
import * as svc from "@/features/courses/services/browse-courses.service"
import type { BrowseCourseDto, CourseSuggestion, BrowseCoursesQuery } from "@/features/courses/types/course.types"

// ── helpers ───────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, ms = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

function fmtPrice(price: number) {
  return price === 0 ? "Free" : `$${price % 1 === 0 ? price : price.toFixed(2)}`
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "free",   label: "Price: Low" },
  { value: "paid",   label: "Price: High" },
] as const

// ── Browse card ───────────────────────────────────────────────────────────────

function BrowseCourseCard({ course }: { course: BrowseCourseDto }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-white/5 overflow-hidden shrink-0">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen size={32} className="text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {course.category && (
          <div className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-medium text-white">
            {course.category}
          </div>
        )}
        <div
          className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            course.price === 0
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          }`}
        >
          {fmtPrice(course.price)}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-white/40 line-clamp-2 flex-1">{course.description}</p>

        <div className="flex items-center gap-3 mt-1 text-[11px] text-white/30">
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            {course.totalLessons} lesson{course.totalLessons !== 1 ? "s" : ""}
          </span>
          {course.tags?.split(",").map(t => t.trim()).filter(Boolean).slice(0, 1).map(tag => (
            <span key={tag} className="rounded-full bg-white/5 border border-white/8 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden animate-pulse">
      <div className="h-44 bg-white/5" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-white/8 rounded-lg w-4/5" />
        <div className="h-3 bg-white/5 rounded-lg w-full" />
        <div className="h-3 bg-white/5 rounded-lg w-3/4" />
        <div className="h-3 bg-white/4 rounded-lg w-1/3 mt-3" />
      </div>
    </div>
  )
}

// ── Suggestion icon ───────────────────────────────────────────────────────────

function SuggestionIcon({ type }: { type: string }) {
  if (type === "category") return <Grid3X3 size={13} className="text-blue-400 shrink-0" />
  if (type === "tag") return <Tag size={13} className="text-purple-400 shrink-0" />
  return <Search size={13} className="text-white/40 shrink-0" />
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  // search state
  const [inputValue, setInputValue] = useState("")
  const [committedSearch, setCommittedSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownIndex, setDropdownIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // filter state
  const [category, setCategory] = useState<string>("")
  const [sort, setSort] = useState<BrowseCoursesQuery["sort"]>("newest")
  const [freeOnly, setFreeOnly] = useState<boolean | undefined>(undefined)
  const [page, setPage] = useState(0)
  const [allCourses, setAllCourses] = useState<BrowseCourseDto[]>([])

  const debouncedInput = useDebounce(inputValue, 350)

  // ── suggestions ─────────────────────────────────────────────────────────────

  const { data: suggestions = [] } = useQuery<CourseSuggestion[]>({
    queryKey: ["course-suggestions", debouncedInput],
    queryFn: () => svc.getCourseSuggestions(debouncedInput),
    enabled: debouncedInput.length >= 2,
    staleTime: 30_000,
  })

  // ── categories ──────────────────────────────────────────────────────────────

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["course-categories"],
    queryFn: svc.getCourseCategories,
    staleTime: 5 * 60_000,
  })

  // ── browse results ──────────────────────────────────────────────────────────

  const browseQuery: BrowseCoursesQuery = {
    search: committedSearch || undefined,
    category: category || undefined,
    freeOnly,
    page,
    pageSize: 20,
    sort,
  }

  const { data: browseResult, isFetching } = useQuery({
    queryKey: ["courses-browse", browseQuery],
    queryFn: () => svc.browseCourses(browseQuery),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })

  // Accumulate pages for "load more"
  useEffect(() => {
    if (!browseResult) return
    if (page === 0) {
      setAllCourses(browseResult.courses)
    } else {
      setAllCourses(prev => {
        const ids = new Set(prev.map(c => c.id))
        return [...prev, ...browseResult.courses.filter(c => !ids.has(c.id))]
      })
    }
  }, [browseResult, page])

  // Reset page when filters change
  useEffect(() => {
    setPage(0)
    setAllCourses([])
  }, [committedSearch, category, freeOnly, sort])

  // ── inline ghost text (keyboard prediction) ─────────────────────────────────

  const firstSuggestion = suggestions[0]
  const ghostValue =
    firstSuggestion &&
    inputValue.length >= 2 &&
    firstSuggestion.text.toLowerCase().startsWith(inputValue.toLowerCase())
      ? inputValue + firstSuggestion.text.slice(inputValue.length)
      : ""

  // ── commit search ────────────────────────────────────────────────────────────

  const commitSearch = useCallback((value: string) => {
    setCommittedSearch(value)
    setInputValue(value)
    setShowDropdown(false)
    setDropdownIndex(-1)
    inputRef.current?.blur()
  }, [])

  // ── keyboard handler ─────────────────────────────────────────────────────────

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && ghostValue) {
      e.preventDefault()
      setInputValue(ghostValue)
      return
    }

    if (e.key === "ArrowRight" && ghostValue && inputRef.current) {
      const el = inputRef.current
      if (el.selectionStart === el.value.length) {
        e.preventDefault()
        setInputValue(ghostValue)
        return
      }
    }

    if (e.key === "Escape") {
      setShowDropdown(false)
      setDropdownIndex(-1)
      return
    }

    if (e.key === "Enter") {
      if (dropdownIndex >= 0 && suggestions[dropdownIndex]) {
        commitSearch(suggestions[dropdownIndex].text)
      } else {
        commitSearch(inputValue)
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setDropdownIndex(i => Math.min(i + 1, suggestions.length - 1))
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setDropdownIndex(i => Math.max(i - 1, -1))
    }
  }

  // ── click outside to close ───────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const totalCount = browseResult?.totalCount ?? 0
  const hasMore = browseResult?.hasMore ?? false
  const showSkeletons = isFetching && page === 0

  return (
    <div className="min-h-full space-y-8 pb-16">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative pt-10 pb-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute top-4 right-1/4 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles size={16} className="text-blue-400" />
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
            Course Library
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Discover Courses</h1>
        <p className="text-white/40 text-sm mb-8">
          {totalCount > 0 ? `${totalCount} published courses` : "Explore what's available"}
        </p>

        {/* ── Search bar with ghost-text prediction ──────────────────────── */}
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.05] shadow-xl shadow-black/20 focus-within:border-white/25 focus-within:bg-white/[0.07] transition-all">
            {/* Ghost text layer */}
            {ghostValue && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center pl-12 pr-12 text-base overflow-hidden"
              >
                <span className="invisible whitespace-pre">{inputValue}</span>
                <span className="text-white/25 whitespace-pre">
                  {ghostValue.slice(inputValue.length)}
                </span>
              </div>
            )}

            {/* Search icon */}
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />

            {/* Actual input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              placeholder="Search courses, categories, tags…"
              autoComplete="off"
              spellCheck={false}
              onChange={e => {
                setInputValue(e.target.value)
                setDropdownIndex(-1)
                setShowDropdown(e.target.value.length >= 1)
                if (!e.target.value) {
                  setCommittedSearch("")
                }
              }}
              onFocus={() => inputValue.length >= 1 && setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="relative w-full bg-transparent py-4 pl-12 pr-12 text-base text-white placeholder-white/25 outline-none"
            />

            {/* Clear / hint */}
            {inputValue ? (
              <button
                onClick={() => {
                  setInputValue("")
                  setCommittedSearch("")
                  setShowDropdown(false)
                  inputRef.current?.focus()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
              >
                <X size={16} />
              </button>
            ) : (
              ghostValue && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-white/20 select-none">
                  Tab ↹
                </span>
              )
            )}
          </div>

          {/* ── Suggestions dropdown ─────────────────────────────────────── */}
          {showDropdown && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-4 right-4 top-full mt-2 z-50 rounded-2xl border border-white/10 bg-[#13131f] shadow-2xl shadow-black/40 overflow-hidden"
            >
              {/* Group by type */}
              {(["course", "category", "tag"] as const).map(type => {
                const group = suggestions.filter(s => s.type === type)
                if (!group.length) return null
                const label = type === "course" ? "Courses" : type === "category" ? "Categories" : "Tags"
                return (
                  <div key={type}>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                      {label}
                    </div>
                    {group.map((s, idx) => {
                      const globalIdx = suggestions.indexOf(s)
                      const isActive = globalIdx === dropdownIndex
                      const query = inputValue.toLowerCase()
                      const matchIdx = s.text.toLowerCase().indexOf(query)
                      const before = matchIdx >= 0 ? s.text.slice(0, matchIdx) : ""
                      const match = matchIdx >= 0 ? s.text.slice(matchIdx, matchIdx + query.length) : s.text
                      const after = matchIdx >= 0 ? s.text.slice(matchIdx + query.length) : ""

                      return (
                        <button
                          key={s.text + type}
                          onMouseDown={e => {
                            e.preventDefault()
                            commitSearch(s.text)
                          }}
                          onMouseEnter={() => setDropdownIndex(globalIdx)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm text-left transition ${
                            isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                          }`}
                        >
                          <SuggestionIcon type={s.type} />
                          <span className="truncate">
                            <span className="text-white/40">{before}</span>
                            <span className="text-white font-medium">{match}</span>
                            <span className="text-white/40">{after}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
              <div className="border-t border-white/5 px-4 py-2 text-[11px] text-white/20 flex items-center gap-4">
                <span>↑↓ navigate</span>
                <span>↵ search</span>
                <span>Tab / → accept prediction</span>
                <span>Esc close</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <SlidersHorizontal size={14} className="text-white/30 shrink-0" />
          {[{ value: "", label: "All" }, ...categories.map(c => ({ value: c, label: c }))].map(opt => (
            <button
              key={opt.value}
              onClick={() => setCategory(opt.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                category === opt.value
                  ? "border-blue-500/50 bg-blue-500/15 text-blue-400"
                  : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {opt.label}
            </button>
          ))}

          <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />

          {/* Free / Paid */}
          {([
            { value: undefined, label: "Any price" },
            { value: true,      label: "Free" },
            { value: false,     label: "Paid" },
          ] as { value: boolean | undefined; label: string }[]).map(opt => (
            <button
              key={opt.label}
              onClick={() => setFreeOnly(opt.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                freeOnly === opt.value
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                  : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative shrink-0">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            className="appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 pr-8 text-xs font-medium text-white/60 outline-none transition hover:border-white/20 focus:border-white/20 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} className="bg-[#13131f]">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────────────── */}
      {!isFetching && (
        <div className="text-xs text-white/25">
          {totalCount === 0
            ? "No courses found"
            : `${totalCount} course${totalCount !== 1 ? "s" : ""}${committedSearch ? ` for "${committedSearch}"` : ""}`}
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      {showSkeletons ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : allCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allCourses.map(course => (
              <BrowseCourseCard key={course.id} course={course} />
            ))}
            {/* Append skeleton row while fetching next page */}
            {isFetching && page > 0 && Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={`sk-${i}`} />
            ))}
          </div>

          {hasMore && !isFetching && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                Load more courses
              </button>
            </div>
          )}
        </>
      ) : (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <BookOpen size={32} className="text-white/15" />
          </div>
          <p className="text-sm font-semibold text-white/40">No courses found</p>
          <p className="mt-1 text-xs text-white/20">
            {committedSearch
              ? `No results for "${committedSearch}". Try a different search.`
              : "No published courses match your filters."}
          </p>
          {(committedSearch || category || freeOnly !== undefined) && (
            <button
              onClick={() => {
                setInputValue("")
                setCommittedSearch("")
                setCategory("")
                setFreeOnly(undefined)
                setSort("newest")
              }}
              className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/10 hover:text-white/70"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
