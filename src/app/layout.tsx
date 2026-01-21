import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppConfiguration } from "../configurations/app.config";
import "./globals.css";

import { Providers } from "@/src/providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: AppConfiguration.APP_NAME,
  description: AppConfiguration.APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
