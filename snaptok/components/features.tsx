"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, Download, Smartphone } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

export function Features() {
  const { lang } = useLang();
  const features = [
    { icon: Zap,        title: t(tr.features.fast_t,  lang), description: t(tr.features.fast_d,   lang) },
    { icon: Shield,     title: t(tr.features.safe_t,  lang), description: t(tr.features.safe_d,   lang) },
    { icon: Download,   title: t(tr.features.nowm_t,  lang), description: t(tr.features.nowm_d,   lang) },
    { icon: Smartphone, title: t(tr.features.multi_t, lang), description: t(tr.features.multi_d,  lang) },
  ];
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-balance">
          {t(tr.features.why_tiktok, lang)}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
