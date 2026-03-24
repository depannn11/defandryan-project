"use client";
import { DouyinHeader } from "@/components/douyin-header";
import { DouyinFooter } from "@/components/douyin-footer";
import { DouyinForm } from "@/components/douyin-form";
import { DouyinFeatures } from "@/components/douyin-features";
import { Stats } from "@/components/stats";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export default function DouyinPage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <DouyinHeader />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              {t(tr.douyin_home.hero_title, lang).replace(t(tr.douyin_home.hero_grad, lang), "")}{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                {t(tr.douyin_home.hero_grad, lang)}
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
              <strong className="text-foreground">SnapYin</strong> — {t(tr.douyin_home.hero_sub, lang)}
            </p>
            <Stats />
          </div>
        </section>

        {/* ── Download Form ── */}
        <section className="pb-16 px-4">
          <div className="container mx-auto"><DouyinForm /></div>
        </section>

        {/* ── Features ── */}
        <DouyinFeatures />

        {/* ── How It Works ── */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              {t(tr.guide_page.subtitle_douyin, lang)}
            </h2>
            <ol className="space-y-6">
              {[
                { step: "1", title: "Copy the Douyin Link", desc: "Open the Douyin (抖音) app, find the video you want to save, tap Share, then tap \"Copy Link\"." },
                { step: "2", title: "Paste the Link into SnapYin", desc: "Return to SnapYin and paste the copied link into the input box above, or tap the Clipboard button." },
                { step: "3", title: "Download Without Watermark", desc: "Tap \"Download Now\" and save the HD video without any watermark or Douyin logo to your device." },
              ].map((item) => (
                <li key={item.step} className="flex gap-5 items-start">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg">
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

        {/* ── SEO content ── */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">About SnapYin</h2>
            <p>
              SnapYin is a free Douyin (抖音) video downloader that lets you save videos from
              ByteDance&apos;s Chinese platform in HD quality without any watermark. Douyin is the
              Chinese version of TikTok and hosts millions of exclusive videos not available on TikTok.
            </p>
            <p>
              With SnapYin, you can download Douyin videos in HD quality directly to your phone or
              computer — no apps to install, no account required. Simply copy the video link from the
              Douyin app, paste it here, and save it instantly.
            </p>
          </div>
        </section>
      </main>
      <DouyinFooter />
    </div>
  );
}
