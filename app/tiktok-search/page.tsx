"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TikTokSearch } from "@/components/tiktok-search";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export default function TikTokSearchPage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t(tr.search.tab_search, lang)}
          </h1>
          <p className="text-muted-foreground">{t(tr.tiktok_home.hero_sub, lang)}</p>
        </div>
        <TikTokSearch />
      </main>
      <Footer />
    </div>
  );
}
