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
    <div className="min-h-screen bg-[#181823] text-white">
      <MainNav userName={mockUser.name} userAvatar={mockUser.avatar} />
      <main className="mx-auto max-w-360 px-4 pb-14 pt-0 sm:px-6 lg:px-10">
        {children}
      </main>
    </div>
  );
}
