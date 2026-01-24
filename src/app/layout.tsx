import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppConfiguration } from "../configurations/app.config";
import "./globals.css";

import { Providers } from "@/src/providers/providers";

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
