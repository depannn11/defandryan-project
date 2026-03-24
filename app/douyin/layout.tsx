import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SnapYin — Download Douyin (抖音) Without Watermark | Free HD",
  description: "SnapYin — Download Douyin (抖音) HD videos without watermark FREE. Fast, safe and free, no registration required. Works on all devices.",
  alternates: { canonical: "https://snaptok.my.id/douyin" },
};
export default function DouyinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
