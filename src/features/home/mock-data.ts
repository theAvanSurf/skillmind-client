// ─── Hero / Carousel ──────────────────────────────────────────────────────────
export const heroSlides = [
  {
    id: "h1",
    title: "Master System Design",
    subtitle: "From zero to architect — learn how top engineers build at scale.",
    badge: "Trending",
    category: "Engineering",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-blue-900/80 via-blue-900/40 to-transparent",
    progress: 0,
    href: "#",
  },
  {
    id: "h2",
    title: "Deep Learning A–Z",
    subtitle: "Build neural networks from scratch and deploy real AI models.",
    badge: "New",
    category: "AI & ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-indigo-900/80 via-indigo-900/40 to-transparent",
    progress: 0,
    href: "#",
  },
  {
    id: "h3",
    title: "Full-Stack with Next.js 15",
    subtitle: "Ship production apps using the latest React & Next.js features.",
    badge: "Popular",
    category: "Web Dev",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-cyan-900/80 via-cyan-900/40 to-transparent",
    progress: 0,
    href: "#",
  },
  {
    id: "h4",
    title: "iOS Development with SwiftUI",
    subtitle: "Design and ship beautiful native apps for Apple platforms.",
    badge: "Top Rated",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-slate-900/80 via-slate-900/40 to-transparent",
    progress: 0,
    href: "#",
  },
];

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = [
  { id: "c1", label: "Web Dev",   icon: "🌐", count: 142, color: "from-blue-600 to-blue-800",    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80" },
  { id: "c2", label: "AI & ML",   icon: "🤖", count: 89,  color: "from-indigo-600 to-violet-800", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" },
  { id: "c3", label: "Mobile",    icon: "📱", count: 67,  color: "from-sky-500 to-cyan-700",     image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" },
  { id: "c4", label: "Design",    icon: "🎨", count: 53,  color: "from-pink-500 to-rose-700",    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" },
  { id: "c5", label: "DevOps",    icon: "⚙️", count: 44,  color: "from-emerald-500 to-teal-700", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
  { id: "c6", label: "Security",  icon: "🔒", count: 38,  color: "from-amber-500 to-orange-700",  image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80" },
];

// ─── Continue Watching cards (rectangular) ────────────────────────────────────
export const continueWatching = [
  {
    id: "cw1",
    title: "Advanced React Patterns",
    category: "Web Dev",
    progress: 64,
    duration: "12h 30m",
    lessons: 32,
    currentLesson: "Compound Components",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cw2",
    title: "TypeScript Essentials",
    category: "Web Dev",
    progress: 42,
    duration: "8h 10m",
    lessons: 21,
    currentLesson: "Generic Types & Constraints",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cw3",
    title: "UI/UX for Developers",
    category: "Design",
    progress: 78,
    duration: "6h 45m",
    lessons: 18,
    currentLesson: "Motion Design Principles",
    image: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cw4",
    title: "System Design Fundamentals",
    category: "Engineering",
    progress: 21,
    duration: "14h 00m",
    lessons: 40,
    currentLesson: "CAP Theorem Explained",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cw5",
    title: "Docker & Kubernetes",
    category: "DevOps",
    progress: 55,
    duration: "10h 20m",
    lessons: 28,
    currentLesson: "Kubernetes Services & Ingress",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
  },
];

// ─── Because you watched X → recommend Y ─────────────────────────────────────
export const becauseYouWatched = {
  sourceCourse: "Advanced React Patterns",
  recommendations: [
    {
      id: "by1",
      title: "React Performance Mastery",
      category: "Web Dev",
      rating: 4.9,
      students: "18k",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "by2",
      title: "Next.js 15 Full Stack",
      category: "Web Dev",
      rating: 4.8,
      students: "24k",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "by3",
      title: "State Management with Zustand",
      category: "Web Dev",
      rating: 4.7,
      students: "9k",
      image: "https://images.unsplash.com/photo-1587620962725-abab19836100?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "by4",
      title: "Testing React Applications",
      category: "Web Dev",
      rating: 4.6,
      students: "11k",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "by5",
      title: "Micro-Frontends Architecture",
      category: "Engineering",
      rating: 4.8,
      students: "6k",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
    },
  ],
};

// ─── Personalised recommendations ────────────────────────────────────────────
export const personalRecommendations = [
  {
    id: "pr1",
    title: "Deep Learning A–Z",
    category: "AI & ML",
    rating: 4.9,
    students: "42k",
    duration: "22h",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pr2",
    title: "GraphQL Masterclass",
    category: "Backend",
    rating: 4.7,
    students: "14k",
    duration: "9h",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pr3",
    title: "iOS with SwiftUI",
    category: "Mobile",
    rating: 4.8,
    students: "19k",
    duration: "16h",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pr4",
    title: "AWS Cloud Practitioner",
    category: "DevOps",
    rating: 4.9,
    students: "31k",
    duration: "18h",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pr5",
    title: "Figma for Developers",
    category: "Design",
    rating: 4.6,
    students: "8k",
    duration: "6h",
    image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pr6",
    title: "Rust from Zero to Hero",
    category: "Systems",
    rating: 4.8,
    students: "7k",
    duration: "20h",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
];

// ─── Motivational tips ────────────────────────────────────────────────────────
export const motivationalTips = [
  {
    id: "mt1",
    emoji: "🔥",
    title: "You're on a 6-day streak!",
    body: "Keep going — learners who study daily are 5× more likely to finish courses.",
  },
  {
    id: "mt2",
    emoji: "⚡",
    title: "Quick win: 15 minutes today",
    body: "Even a short session keeps momentum. Resume TypeScript Essentials — you're 42% through.",
  },
  {
    id: "mt3",
    emoji: "🎯",
    title: "3 lessons from finishing UI/UX for Developers",
    body: "You're at 78% — a focused hour tonight gets you a certificate.",
  },
];
