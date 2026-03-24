"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/lang-context";
import { LANGUAGES, LangCode } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Select language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-xl border border-border bg-background shadow-lg overflow-hidden">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as LangCode); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-muted ${
                lang === l.code ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
