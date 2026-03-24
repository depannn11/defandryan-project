"use client";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DownloadForm } from "@/components/download-form";
import { Features } from "@/components/features";
import { Stats } from "@/components/stats";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode, LANGUAGES } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default function LangTikTokPage({ params }: { params: { lang: string } }) {
  const { lang, setLang } = useLang();
  const paramLang = params.lang;

  const validLang = LANGUAGES.find((l) => l.code === paramLang);
  if (!validLang) notFound();

  useEffect(() => {
    if (paramLang !== lang) setLang(paramLang as LangCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramLang]);

  const displayLang = (validLang ? paramLang : "en") as LangCode;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              {t(tr.tiktok_home.hero_title, displayLang).replace(t(tr.tiktok_home.hero_grad, displayLang), "")}{" "}
              <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                {t(tr.tiktok_home.hero_grad, displayLang)}
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
              <strong className="text-foreground">Snaptok</strong> — {t(tr.tiktok_home.hero_sub, displayLang)}
            </p>
            <Stats />
          </div>
        </section>
        <section className="pb-16 px-4">
          <div className="container mx-auto"><DownloadForm /></div>
        </section>
        <Features />
      </main>
      <Footer />
    </div>
  );
}
