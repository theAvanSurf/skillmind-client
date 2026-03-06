import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppConfiguration } from "../configurations/app.config";
import "./globals.css";

import { Providers } from "src/providers/providers";
import { Toaster } from "sileo";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: AppConfiguration.APP_NAME,
  description: AppConfiguration.APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <Toaster
          position="top-center"
          offset={32}
          options={{
            fill: "#111111",
            roundness: 24,
            styles: {
              title: "text-[15px] font-bold text-white tracking-tight text-center!",
              description: "text-[13px] text-white/60 font-medium leading-relaxed text-center!",
              badge: "bg-white/10!",
              button: "bg-white/10! hover:bg-white/15!",
            },
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
