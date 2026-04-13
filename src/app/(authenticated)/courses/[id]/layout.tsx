import type { ReactNode } from "react";

// This layout overrides the parent's padded/constrained <main> for the
// course details page which needs a full-bleed, full-viewport design.
export default function CourseDetailsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="fixed inset-0 top-16 overflow-y-auto bg-[#0e0e10] text-white z-10">
            {children}
        </div>
    );
}
