"use client";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TikTokSearch } from "@/components/tiktok-search";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode, LANGUAGES } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default function LangSearchPage({ params }: { params: { lang: string } }) {
  const { lang, setLang } = useLang();
  const paramLang = params.lang;

  // Validate language code
  const validLang = LANGUAGES.find((l) => l.code === paramLang);
  if (!validLang) notFound();

  useEffect(() => {
    if (paramLang !== lang) setLang(paramLang as LangCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramLang]);

  // Use paramLang directly for SSR consistency
  const displayLang = (validLang ? paramLang : "en") as LangCode;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t(tr.search.tab_search, displayLang)}
          </h1>
          <p className="text-muted-foreground">{t(tr.tiktok_home.hero_sub, displayLang)}</p>
        </div>
        <TikTokSearch />
      </main>
      <Footer />
    </div>
  );
}
