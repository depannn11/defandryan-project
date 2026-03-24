"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faShield, faDownload, faGlobe, faStar, faFilm } from "@fortawesome/free-solid-svg-icons";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export function DouyinFeatures() {
  const { lang } = useLang();

  const features = [
    {
      icon: faBolt,
      title: t(tr.features.fast_t, lang),
      description: t(tr.features.fast_d, lang),
      color: "from-red-500 to-orange-500",
      bg: "bg-red-50 dark:bg-red-950/30",
      badge: "⚡",
    },
    {
      icon: faShield,
      title: t(tr.features.safe_t, lang),
      description: t(tr.features.safe_d, lang),
      color: "from-red-600 to-red-400",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      badge: "🛡️",
    },
    {
      icon: faDownload,
      title: t(tr.features.nowm_t, lang),
      description: t(tr.features.nowm_d_dy, lang),
      color: "from-red-500 to-pink-500",
      bg: "bg-pink-50 dark:bg-pink-950/30",
      badge: "✨",
    },
    {
      icon: faGlobe,
      title: t(tr.features.china_t, lang),
      description: t(tr.features.china_d, lang),
      color: "from-red-700 to-red-500",
      bg: "bg-red-50 dark:bg-red-950/30",
      badge: "🇨🇳",
    },
    {
      icon: faFilm,
      title: "Photo Slideshow",
      description: "Download all photos from Douyin image posts — swipe & save each one.",
      color: "from-rose-500 to-red-500",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      badge: "🖼️",
    },
    {
      icon: faStar,
      title: t(tr.features.multi_t, lang),
      description: t(tr.features.multi_d, lang),
      color: "from-red-400 to-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      badge: "📱",
    },
  ];

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-orange-50/30 dark:from-red-950/20 dark:to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent dark:via-red-800" />

      <div className="container mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 mb-4">
            <span>🎬</span>
            {t(tr.features.why_douyin, lang)}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              SnapYin
            </span>{" "}
            — 抖音视频下载
          </h2>
          <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            The fastest way to save Douyin (抖音) videos and photos without watermark
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-red-100 dark:border-red-900 ${f.bg} p-5 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-red-300 dark:hover:border-red-700 overflow-hidden`}
            >
              <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${f.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-sm`}>
                  <FontAwesomeIcon icon={f.icon} className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    {f.title}
                    <span className="text-base leading-none">{f.badge}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
