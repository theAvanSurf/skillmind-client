import type { ReactNode } from "react";

import MainNav from "@/src/components/main-nav";

type Props = {
  children: ReactNode;
};

const mockUser = {
  name: "Sabrina",
  avatar: null as string | null,
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#0f172a]">
      <MainNav userName={mockUser.name} userAvatar={mockUser.avatar} />

      <main className="mx-auto max-w-6xl px-6 pb-12 pt-8 md:px-4 md:pt-6">
        {children}
      </main>
    </div>
  );
}
