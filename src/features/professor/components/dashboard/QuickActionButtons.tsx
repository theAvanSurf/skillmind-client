"use client";

import { Plus, Download, Send, Settings } from "lucide-react";
import Link from "next/link";

export default function QuickActionButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600">
        <Plus className="h-4 w-4" />
        Create New Course
      </button>
      <button className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/18">
        <Download className="h-4 w-4" />
        Download Report
      </button>
      <button className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/18">
        <Send className="h-4 w-4" />
        Send Message
      </button>
      <Link
        href="/professor/settings"
        className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/18"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
    </div>
  );
}
