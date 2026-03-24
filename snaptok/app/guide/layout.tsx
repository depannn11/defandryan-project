import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "How to Download TikTok Videos — Step by Step Guide | Snaptok",
  description: "Step-by-step guide on how to download TikTok & Douyin videos without watermark using Snaptok. Works on iPhone, Android, PC and Mac.",
  alternates: { canonical: "https://snaptok.my.id/guide" },
};
export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
