import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { LangProvider } from "@/lib/lang-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://snaptok.my.id";
const META_DESC =
  "Snaptok — Download TikTok & Douyin videos without watermark FREE. Save HD videos, MP3 audio, and images in seconds. Fast, safe, no registration required.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Snaptok — Download TikTok Without Watermark | Free HD & MP3",
    template: "%s | Snaptok",
  },
  description: META_DESC,
  keywords: [
    "tiktok downloader",
    "download tiktok",
    "tiktok no watermark",
    "tiktok video downloader",
    "mp3 tiktok",
    "douyin downloader",
    "download douyin",
    "tiktok hd download",
    "save tiktok video",
    "snaptok",
  ],
  authors: [{ name: "Snaptok", url: SITE_URL }],
  creator: "Snaptok",
  publisher: "Snaptok",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en/tiktok`,
      id: `${SITE_URL}/id/tiktok`,
      ru: `${SITE_URL}/ru/tiktok`,
      zh: `${SITE_URL}/zh/tiktok`,
      ar: `${SITE_URL}/ar/tiktok`,
    },
  },
  openGraph: {
    title: "Snaptok — Download TikTok Without Watermark | Free HD & MP3",
    description: META_DESC,
    url: SITE_URL,
    siteName: "Snaptok",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/icon.jpg",
        width: 512,
        height: 512,
        alt: "Snaptok — TikTok Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snaptok — Download TikTok Without Watermark",
    description: META_DESC,
    images: ["/icon.jpg"],
    creator: "@snaptok",
  },
  icons: {
    icon: [
      { url: "/icon.jpg", type: "image/jpeg" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.jpg",
  },
  generator: "snaptok.my.id",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

/** JSON-LD schema — WebSite + SoftwareApplication */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Snaptok",
      description: META_DESC,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Snaptok TikTok Downloader",
      description: META_DESC,
      url: SITE_URL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "10000",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
