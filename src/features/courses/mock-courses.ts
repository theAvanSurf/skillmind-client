import { CourseDto, CourseCardDto } from "./types/course.types";

export const mockCourses: Record<string, CourseDto> = {
  cw1: {
    id: "cw1",
    title: "Advanced React Patterns",
    description: "Master compound components, render props, custom hooks, and all advanced React patterns used in production apps.",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    category: "Web Dev",
    seasons: [
      {
        id: "cw1-s1", courseId: "cw1", title: "Season 1: Foundations", order: 1,
        lessons: [
          { id: "cw1-s1-l1", seasonId: "cw1-s1", title: "Compound Components", description: "Build flexible component APIs.", order: 1, videoUrl: "", durationSeconds: 720 },
          { id: "cw1-s1-l2", seasonId: "cw1-s1", title: "Render Props Pattern", description: "Share logic between components.", order: 2, videoUrl: "", durationSeconds: 540 },
          { id: "cw1-s1-l3", seasonId: "cw1-s1", title: "Custom Hooks Deep Dive", description: "Extract and reuse stateful logic.", order: 3, videoUrl: "", durationSeconds: 660 },
        ],
      },
      {
        id: "cw1-s2", courseId: "cw1", title: "Season 2: Advanced Patterns", order: 2,
        lessons: [
          { id: "cw1-s2-l1", seasonId: "cw1-s2", title: "Context + Reducer", description: "Scalable state without Redux.", order: 1, videoUrl: "", durationSeconds: 780 },
          { id: "cw1-s2-l2", seasonId: "cw1-s2", title: "Performance Optimization", description: "memo, useMemo, useCallback.", order: 2, videoUrl: "", durationSeconds: 600 },
        ],
      },
    ],
  },
  cw2: {
    id: "cw2",
    title: "TypeScript Essentials",
    description: "Go from JavaScript to TypeScript with confidence. Generics, utility types, decorators, and real-world patterns.",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    category: "Web Dev",
    seasons: [
      {
        id: "cw2-s1", courseId: "cw2", title: "Season 1: Core Types", order: 1,
        lessons: [
          { id: "cw2-s1-l1", seasonId: "cw2-s1", title: "Type System Basics", description: "Primitives, unions, intersections.", order: 1, videoUrl: "", durationSeconds: 480 },
          { id: "cw2-s1-l2", seasonId: "cw2-s1", title: "Generic Types & Constraints", description: "Write reusable typed code.", order: 2, videoUrl: "", durationSeconds: 600 },
          { id: "cw2-s1-l3", seasonId: "cw2-s1", title: "Utility Types", description: "Partial, Pick, Omit and more.", order: 3, videoUrl: "", durationSeconds: 540 },
        ],
      },
    ],
  },
  cw3: {
    id: "cw3",
    title: "UI/UX for Developers",
    description: "Design beautiful interfaces without a designer. Learn spacing, typography, color theory, and motion design.",
    thumbnailUrl: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1600&q=80",
    category: "Design",
    seasons: [
      {
        id: "cw3-s1", courseId: "cw3", title: "Season 1: Visual Fundamentals", order: 1,
        lessons: [
          { id: "cw3-s1-l1", seasonId: "cw3-s1", title: "Color Theory", description: "Build palettes that work.", order: 1, videoUrl: "", durationSeconds: 480 },
          { id: "cw3-s1-l2", seasonId: "cw3-s1", title: "Typography Scale", description: "Type hierarchy and readability.", order: 2, videoUrl: "", durationSeconds: 420 },
          { id: "cw3-s1-l3", seasonId: "cw3-s1", title: "Motion Design Principles", description: "Animate with purpose.", order: 3, videoUrl: "", durationSeconds: 660 },
        ],
      },
    ],
  },
  cw4: {
    id: "cw4",
    title: "System Design Fundamentals",
    description: "Learn how to design scalable, resilient distributed systems. CAP theorem, caching, load balancing, and more.",
    thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    category: "Engineering",
    seasons: [
      {
        id: "cw4-s1", courseId: "cw4", title: "Season 1: Core Concepts", order: 1,
        lessons: [
          { id: "cw4-s1-l1", seasonId: "cw4-s1", title: "CAP Theorem Explained", description: "Consistency vs availability.", order: 1, videoUrl: "", durationSeconds: 720 },
          { id: "cw4-s1-l2", seasonId: "cw4-s1", title: "Load Balancing Strategies", description: "Round robin, least connections.", order: 2, videoUrl: "", durationSeconds: 600 },
          { id: "cw4-s1-l3", seasonId: "cw4-s1", title: "Caching Layers", description: "Redis, CDN, browser cache.", order: 3, videoUrl: "", durationSeconds: 780 },
        ],
      },
    ],
  },
  cw5: {
    id: "cw5",
    title: "Docker & Kubernetes",
    description: "Containerize your apps and orchestrate them at scale. From docker run to full Kubernetes deployments.",
    thumbnailUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1600&q=80",
    category: "DevOps",
    seasons: [
      {
        id: "cw5-s1", courseId: "cw5", title: "Season 1: Docker", order: 1,
        lessons: [
          { id: "cw5-s1-l1", seasonId: "cw5-s1", title: "Containers vs VMs", description: "Why containers won.", order: 1, videoUrl: "", durationSeconds: 480 },
          { id: "cw5-s1-l2", seasonId: "cw5-s1", title: "Dockerfile Best Practices", description: "Lean, secure images.", order: 2, videoUrl: "", durationSeconds: 600 },
        ],
      },
      {
        id: "cw5-s2", courseId: "cw5", title: "Season 2: Kubernetes", order: 2,
        lessons: [
          { id: "cw5-s2-l1", seasonId: "cw5-s2", title: "Pods & Deployments", description: "Core Kubernetes objects.", order: 1, videoUrl: "", durationSeconds: 720 },
          { id: "cw5-s2-l2", seasonId: "cw5-s2", title: "Kubernetes Services & Ingress", description: "Expose your apps.", order: 2, videoUrl: "", durationSeconds: 660 },
        ],
      },
    ],
  },
};

// Fallback for IDs not explicitly defined (by1-by5, pr1-pr6, h1-h4)
const fallbackImages: Record<string, string> = {
  by1: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
  by2: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80",
  by3: "https://images.unsplash.com/photo-1587620962725-abab19836100?auto=format&fit=crop&w=1600&q=80",
  by4: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1600&q=80",
  by5: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
  pr1: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
  pr2: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1600&q=80",
  pr3: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
  pr4: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
  pr5: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=1600&q=80",
  pr6: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  h1: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
  h2: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
  h3: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80",
  h4: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
};

export function getMockCourse(id: string): CourseDto {
  if (mockCourses[id]) return mockCourses[id];

  // Generic fallback for any ID
  return {
    id,
    title: "Course Details",
    description: "Explore this course and start learning today.",
    thumbnailUrl: fallbackImages[id] ?? "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    category: "General",
    seasons: [
      {
        id: `${id}-s1`, courseId: id, title: "Season 1", order: 1,
        lessons: [
          { id: `${id}-s1-l1`, seasonId: `${id}-s1`, title: "Introduction", description: "Getting started.", order: 1, videoUrl: "", durationSeconds: 300 },
        ],
      },
    ],
  };
}

export const mockRelatedCourses: CourseCardDto[] = [
  { id: "cw1", title: "Advanced React Patterns", thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80", category: "Web Dev", progressPercent: 64 },
  { id: "cw2", title: "TypeScript Essentials", thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", category: "Web Dev", progressPercent: 42 },
  { id: "pr1", title: "Deep Learning A–Z", thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80", category: "AI & ML" },
  { id: "cw5", title: "Docker & Kubernetes", thumbnailUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80", category: "DevOps" },
  { id: "pr3", title: "iOS with SwiftUI", thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80", category: "Mobile" },
];