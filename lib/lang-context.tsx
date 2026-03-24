"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LANG, LangCode, LANGUAGES } from "./i18n";

const LangContext = createContext<{
  lang: LangCode;
  setLang: (l: LangCode) => void;
}>({ lang: DEFAULT_LANG, setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);

  useEffect(() => {
    // Read from cookie on mount
    const cookie = document.cookie.split("; ").find((r) => r.startsWith("lang="));
    const saved  = cookie?.split("=")[1] as LangCode | undefined;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    document.cookie = `lang=${l};path=/;max-age=31536000`;
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
