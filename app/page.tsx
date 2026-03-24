import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DownloadForm } from "@/components/download-form";
import { Features } from "@/components/features";
import { Stats } from "@/components/stats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snaptok — Download TikTok Without Watermark | Free HD & MP3",
  description:
    "Snaptok — Download TikTok & Douyin videos without watermark FREE. Save HD videos, MP3 audio, and images in seconds. Fast, safe, no registration required.",
  alternates: { canonical: "https://snaptok.my.id" },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              Download TikTok Without{" "}
              <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                Watermark
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
              <strong className="text-foreground">Snaptok</strong> — Download TikTok HD videos,
              MP3 audio, and images without logo. Fast, Safe &amp; Free, no registration required.
              Works on all devices — iPhone, Android, PC, and Mac.
            </p>
            <Stats />
          </div>
        </section>

        {/* ── Download Form ── */}
        <section className="pb-16 px-4">
          <div className="container mx-auto">
            <DownloadForm />
          </div>
        </section>

        {/* ── Features ── */}
        <Features />

        {/* ── How It Works ── */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              How to Download TikTok Videos Without Watermark
            </h2>
            <ol className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Copy the TikTok Link",
                  desc: "Open the TikTok app, find the video you want to save, tap the Share button, then tap \"Copy Link\".",
                },
                {
                  step: "2",
                  title: "Paste the Link into Snaptok",
                  desc: "Return to Snaptok, paste the copied link into the input box above, or tap the Clipboard button.",
                },
                {
                  step: "3",
                  title: "Choose Your Format & Download",
                  desc: "Select HD Video, SD Video, Audio (MP3), or Images. The file will be saved to your device instantly.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-5 items-start">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── About / SEO content ── */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">About Snaptok</h2>
            <p>
              Snaptok is a free, browser-based TikTok downloader that lets you save TikTok and
              Douyin (抖音) videos in HD quality without any watermark or logo. No software to
              install, no account required — just paste a link and download.
            </p>
            <p>
              Whether you want to save a funny clip, a dance tutorial, a recipe video, or a music
              performance, Snaptok lets you download it in multiple formats: HD video, SD video,
              audio-only MP3, or individual images from slideshow posts.
            </p>
            <p>
              Snaptok also supports Douyin (the Chinese version of TikTok) through our dedicated
              <a href="/douyin" className="text-foreground font-medium hover:underline"> Douyin downloader</a>.
              Both platforms are supported with the same fast, watermark-free experience.
            </p>
            <p>
              Developers can access our REST API to integrate TikTok download functionality into
              their own apps.{" "}
              <a href="/docs" className="text-foreground font-medium hover:underline">
                View the API Documentation
              </a>{" "}
              to get started.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
