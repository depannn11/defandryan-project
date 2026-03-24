"use client";
import { useEffect } from "react";
import { DouyinHeader } from "@/components/douyin-header";
import { DouyinFooter } from "@/components/douyin-footer";
import { DouyinForm } from "@/components/douyin-form";
import { DouyinFeatures } from "@/components/douyin-features";
import { Stats } from "@/components/stats";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode, LANGUAGES } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default function LangDouyinPage({ params }: { params: { lang: string } }) {
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
      <DouyinHeader />
      <main className="flex-1">
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              {t(tr.douyin_home.hero_title, displayLang).replace(t(tr.douyin_home.hero_grad, displayLang), "")}{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                {t(tr.douyin_home.hero_grad, displayLang)}
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
              <strong className="text-foreground">SnapYin</strong> — {t(tr.douyin_home.hero_sub, displayLang)}
            </p>
            <Stats />
          </div>
        </section>
        <section className="pb-16 px-4">
          <div className="container mx-auto"><DouyinForm /></div>
        </section>
        <DouyinFeatures />
      </main>
      <DouyinFooter />
    </div>
  );
}
