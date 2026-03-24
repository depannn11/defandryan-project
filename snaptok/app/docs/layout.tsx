import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "API Documentation — TikTok Downloader API | Snaptok",
  description: "Snaptok REST API documentation. Integrate TikTok & Douyin video download into your app. Get your API key by registering for free.",
  alternates: { canonical: "https://snaptok.my.id/docs" },
};
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
