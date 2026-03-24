import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Policy | Snaptok",
  description: "Snaptok privacy policy — how we collect, use, and protect your data when you use our TikTok and Douyin video downloader service.",
  alternates: { canonical: "https://snaptok.my.id/privacy" },
};
export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
