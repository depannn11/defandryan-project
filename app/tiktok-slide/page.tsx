"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DownloadForm } from "@/components/download-form";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export default function TikTokSlidePage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              TikTok{" "}
              <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                Slideshow Downloader
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              <strong className="text-foreground">Snaptok</strong> — {t(tr.tiktok_home.hero_sub, lang)}
            </p>
          </div>
        </section>
        <section className="pb-16 px-4">
          <div className="container mx-auto">
            <DownloadForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
