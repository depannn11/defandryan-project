import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | Snaptok",
  description: "Answers to the most common questions about Snaptok — TikTok & Douyin video downloader. Learn how to download without watermark, supported formats, and more.",
  alternates: { canonical: "https://snaptok.my.id/faq" },
};
export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
