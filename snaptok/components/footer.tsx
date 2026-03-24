"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,

  faMagnifyingGlass,
  faCode,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { faTiktok } from "@fortawesome/free-brands-svg-icons";

export function Footer() {
  const { lang } = useLang();

  const cols = [
    {
      title: "Snaptok",
      links: [
        { href: "/", label: t(tr.nav.home, lang) },
        { href: "/guide", label: t(tr.nav.guide, lang) },
        { href: "/faq", label: t(tr.nav.faq, lang) },
        { href: "/privacy", label: t(tr.nav.privacy, lang) },
      ],
    },
    {
      title: "Tools",
      links: [
        {
          href: "/",
          label: "TikTok Downloader",
          icon: <FontAwesomeIcon icon={faTiktok} className="mr-2 w-4" />,
        },
        {
          href: "/tiktok-search",
          label: "Search TikTok",
          icon: <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 w-4" />,
        },
        {
          href: "/docs",
          label: "API Docs",
          icon: <FontAwesomeIcon icon={faCode} className="mr-2 w-4" />,
        },
        {
          href: "/douyin",
          label: "🎬 Douyin Downloader",
        },
      ],
    },
  ];

  return (
    <footer className="border-t border-primary/20 bg-gradient-to-br from-primary/95 to-primary text-primary-foreground">
      <div className="h-1 bg-gradient-to-r from-primary via-muted-foreground to-primary opacity-60" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faVideo} className="text-2xl w-6 opacity-80" />
              <span className="text-xl font-bold">
                Snap<span className="opacity-60">-Tok</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Download TikTok videos &amp; photos without watermark. Fast, free, no registration required.
            </p>
            <div className="flex items-center gap-2 text-xs text-primary-foreground/50">
              <FontAwesomeIcon icon={faTiktok} className="w-3" />
              <span>TikTok</span>
              <span>·</span>
              <span>Powered by Snaptok</span>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-primary-foreground/70 mb-3 text-sm uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center"
                    >
                      {l.icon}
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 space-y-3">
          <div className="text-xs text-primary-foreground/50 leading-relaxed">
            <strong className="text-primary-foreground/70 inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faCircleInfo} className="w-3" /> Disclaimer:
            </strong>{" "}
            {t(tr.footer.disclaimer_tiktok, lang)}
          </div>
          <p className="text-xs text-primary-foreground/40">
            &copy; {new Date().getFullYear()} Snaptok. {t(tr.footer.rights, lang)}
          </p>
        </div>
      </div>
    </footer>
  );
}
