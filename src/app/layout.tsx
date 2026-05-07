import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Integrated Corporate Digital Identity",
  description:
    "Company profile website and admin dashboard foundation built with Next.js and Supabase.",
};

import { IntroOverlay } from "@/components/global/intro-overlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <IntroOverlay />
        {children}
      </body>
    </html>
  );
}
