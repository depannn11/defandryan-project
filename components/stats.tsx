"use client";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export function Stats() {
  const { lang } = useLang();
  const stats = [
    { value: "100%", label: t(tr.stats.free,    lang) },
    { value: "No",   label: t(tr.stats.no_wm,   lang) },
    { value: "HD",   label: t(tr.stats.quality, lang) },
    { value: "Fast", label: t(tr.stats.fast,    lang) },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
          <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
