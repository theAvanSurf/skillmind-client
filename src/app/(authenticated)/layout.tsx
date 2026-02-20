import type { ReactNode } from "react";
import MainNav from "@/features/layout/components/main-nav";

type Props = {
  children: ReactNode;
};

const mockUser = {
  name: "Sabrina",
  avatar: null as string | null,
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <MainNav userName={mockUser.name} userAvatar={mockUser.avatar} />
      <main className="mx-auto max-w-6xl px-6 pb-14 pt-8 md:px-4 md:pt-7">
        {children}
      </main>
    </div>
  );
}
