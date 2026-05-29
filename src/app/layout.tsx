import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { IntroStorageReset } from "@/components/global/intro-storage-reset";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { StructuredData } from "@/components/seo/StructuredData";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tropicallinedesigns.com'),
  title: {
    default: "Tropical Line Designs - Landscape Architecture Bali Indonesia",
    template: "%s | Tropical Line Designs",
  },
  description:
    "Premier landscape architecture firm in Bali since 1990. Specializing in tropical resort, hotel & villa landscape design and construction. Portfolio: Marriott, Sofitel, Oberoi, IKN.",
  keywords: [
    "landscape design bali",
    "tropical landscape architecture",
    "resort landscape design",
    "hotel landscape architect bali",
    "villa landscape design",
    "landscape construction bali",
    "tropical garden design",
    "landscape architect indonesia",
    "balinese landscape architecture",
    "luxury resort landscape",
  ],
  authors: [{ name: "Tropical Line Designs" }],
  creator: "Tropical Line Designs",
  publisher: "Tropical Line Designs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Tropical Line Designs",
    title: "Tropical Line Designs - Landscape Architecture Bali Indonesia",
    description:
      "Premier landscape architecture firm in Bali since 1990. Specializing in tropical resort, hotel & villa landscape design and construction.",
    images: [
      {
        url: "/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "Tropical Line Designs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tropical Line Designs - Landscape Architecture Bali Indonesia",
    description:
      "Premier landscape architecture firm in Bali since 1990. Specializing in tropical resort, hotel & villa landscape design and construction.",
    images: ["/logo/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body className={`${inter.variable} ${manrope.variable}`}>
        <IntroStorageReset />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
