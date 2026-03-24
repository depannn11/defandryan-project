"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faVideo, 
  faImages, 
  faMagnifyingGlass, 
  faCode,
  faCircleInfo 
} from "@fortawesome/free-solid-svg-icons";
import { faTiktok } from "@fortawesome/free-brands-svg-icons";

export function DouyinFooter() {
  const { lang } = useLang();

  const cols = [
    {
      title: "SnapYin",
      links: [
        { href: "/douyin", label: t(tr.nav.home, lang) },
        { href: "/douyin/guide", label: t(tr.nav.guide, lang) },
        { href: "/douyin/faq", label: t(tr.nav.faq, lang) },
        { href: "/douyin/privacy", label: t(tr.nav.privacy, lang) },
      ],
    },
    {
      title: "Tools",
      links: [
        { 
          href: "/", 
          label: "TikTok Downloader", 
          icon: <FontAwesomeIcon icon={faTiktok} className="mr-2 w-4" /> 
        },
        { 
          href: "/tiktok-slide", 
          label: "TikTok Slideshow", 
          icon: <FontAwesomeIcon icon={faImages} className="mr-2 w-4" /> 
        },
        { 
          href: "/tiktok-search", 
          label: "Search TikTok", 
          icon: <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 w-4" /> 
        },
        { 
          href: "/docs", 
          label: "API Docs", 
          icon: <FontAwesomeIcon icon={faCode} className="mr-2 w-4" /> 
        },
      ],
    },
  ];

  return (
    <footer className="border-t border-red-200 dark:border-red-900 bg-gradient-to-br from-red-950 to-red-900 text-white">
      <div className="h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faVideo} className="text-2xl text-red-400 w-6" />
              <span className="text-xl font-bold">
                Snap<span className="text-red-300">Yin</span>
              </span>
            </div>
            <p className="text-sm text-red-200 leading-relaxed">
              下载抖音视频无水印 — Download Douyin videos and photos without watermark. 
              Fast, free, no registration.
            </p>
            <div className="flex items-center gap-2 text-xs text-red-300">
              <FontAwesomeIcon icon={faTiktok} className="w-3" />
              <span>抖音</span>
              <span>·</span>
              <span>Powered by Snaptok</span>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-red-200 mb-3 text-sm uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-red-300/80 hover:text-white transition-colors flex items-center"
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

        <div className="border-t border-red-800 pt-6 space-y-3">
          <div className="text-xs text-red-300/70 leading-relaxed">
            <strong className="text-red-200 inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faCircleInfo} className="w-3" /> Disclaimer:
            </strong>{" "}
            {t(tr.footer.disclaimer_douyin, lang)}
          </div>
          <p className="text-xs text-red-400">
            &copy; {new Date().getFullYear()} SnapYin by Snaptok. {t(tr.footer.rights, lang)}
          </p>
        </div>
      </div>
    </footer>
  );
}
