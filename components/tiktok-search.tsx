"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, Loader2, Download, Video, Music,
  Play, Heart, MessageCircle, Pause, Key,
  LogIn, ChevronDown, ChevronUp, Info, Copy, Check,
} from "lucide-react";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

/* ─── i18n for this component ─────────────────────────────────────── */
const searchI18n = {
  apikey_label: {
    en: "API Key",
    id: "API Key",
    ru: "API-ключ",
    zh: "API 密钥",
    ar: "مفتاح API",
  },
  apikey_placeholder: {
    en: "Your API key (snp-xxxxx)",
    id: "API Key kamu (snp-xxxxx)",
    ru: "Ваш API-ключ (snp-xxxxx)",
    zh: "你的 API 密钥 (snp-xxxxx)",
    ar: "مفتاح API الخاص بك (snp-xxxxx)",
  },
  show: { en: "Show", id: "Tampil", ru: "Показ.", zh: "显示", ar: "إظهار" },
  hide: { en: "Hide", id: "Sembu.", ru: "Скрыть", zh: "隐藏", ar: "إخفاء" },
  no_apikey: {
    en: "Please enter your API key first.",
    id: "Masukkan API key terlebih dahulu.",
    ru: "Сначала введите API-ключ.",
    zh: "请先输入您的 API 密钥。",
    ar: "يرجى إدخال مفتاح API أولاً.",
  },
  how_to_get: {
    en: "How to get an API key?",
    id: "Cara mendapatkan API key?",
    ru: "Как получить API-ключ?",
    zh: "如何获取 API 密钥？",
    ar: "كيف تحصل على مفتاح API؟",
  },
  tutorial_step1: {
    en: "1. Create a free account",
    id: "1. Buat akun gratis",
    ru: "1. Создайте бесплатный аккаунт",
    zh: "1. 创建免费账户",
    ar: "1. أنشئ حسابًا مجانيًا",
  },
  tutorial_step1_desc: {
    en: "Click Register and sign up with your email.",
    id: "Klik Daftar dan daftar dengan email kamu.",
    ru: "Нажмите «Регистрация» и войдите через email.",
    zh: "点击注册，使用电子邮件完成注册。",
    ar: "انقر على تسجيل وأنشئ حسابك باستخدام بريدك الإلكتروني.",
  },
  tutorial_step2: {
    en: "2. Log in to your account",
    id: "2. Login ke akun kamu",
    ru: "2. Войдите в аккаунт",
    zh: "2. 登录账户",
    ar: "2. سجّل الدخول إلى حسابك",
  },
  tutorial_step2_desc: {
    en: "Go to your Profile page after logging in.",
    id: "Buka halaman Profil setelah login.",
    ru: "Перейдите на страницу профиля после входа.",
    zh: "登录后前往个人中心页面。",
    ar: "انتقل إلى صفحة ملفك الشخصي بعد تسجيل الدخول.",
  },
  tutorial_step3: {
    en: "3. Copy your API key",
    id: "3. Salin API key kamu",
    ru: "3. Скопируйте API-ключ",
    zh: "3. 复制您的 API 密钥",
    ar: "3. انسخ مفتاح API الخاص بك",
  },
  tutorial_step3_desc: {
    en: "Your API key (snp-xxxxx) is shown in the Profile page. Copy and paste it here.",
    id: "API key kamu (snp-xxxxx) ada di halaman Profil. Salin dan tempel di sini.",
    ru: "Ваш API-ключ (snp-xxxxx) отображается в профиле. Скопируйте и вставьте его.",
    zh: "你的 API 密钥 (snp-xxxxx) 显示在个人中心页面，复制后粘贴到此处。",
    ar: "مفتاح API الخاص بك (snp-xxxxx) موجود في صفحة الملف الشخصي. انسخه والصقه هنا.",
  },
  go_register: {
    en: "Register Now",
    id: "Daftar Sekarang",
    ru: "Зарегистрироваться",
    zh: "立即注册",
    ar: "سجّل الآن",
  },
  go_login: {
    en: "Login",
    id: "Masuk",
    ru: "Войти",
    zh: "登录",
    ar: "تسجيل الدخول",
  },
  go_profile: {
    en: "Go to Profile",
    id: "Buka Profil",
    ru: "В профиль",
    zh: "前往个人中心",
    ar: "اذهب إلى الملف الشخصي",
  },
};

function ts(key: keyof typeof searchI18n, lang: string): string {
  const map = searchI18n[key] as Record<string, string>;
  return map[lang] ?? map.en ?? "";
}

/* ─── helpers ─────────────────────────────────────────────────────── */
interface SearchVideo {
  id: string;
  title: string;
  cover: string;
  duration: number;
  author: { nickname: string; unique_id: string; avatar: string };
  stats: { play: number; likes: number; comment: number; share: number };
  download: {
    video_hd: string | null;
    video_sd: string | null;
    video_watermark: string | null;
    audio: string | null;
  };
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
function fmtDur(sec: number): string {
  return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;
}

/* ─── VideoCard ────────────────────────────────────────────────────── */
function VideoCard({ video, apikey }: { video: SearchVideo; apikey: string }) {
  const { lang } = useLang();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [playing, setPlaying]         = useState(false);
  const [dlError, setDlError]         = useState("");
  const videoRef                      = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else         { videoRef.current.play();  setPlaying(true);  }
  };

  const downloadFile = async (url: string, filename: string, key: string) => {
    setDownloading(key); setDlError("");
    try {
      const blob    = await fetch(url).then((r) => r.blob());
      const blobUrl = URL.createObjectURL(blob);
      const a       = Object.assign(document.createElement("a"), { href: blobUrl, download: filename });
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(blobUrl); a.remove();
    } catch { setDlError(t(tr.err.dl_failed, lang)); }
    finally  { setDownloading(null); }
  };

  const playUrl = video.download.video_hd ?? video.download.video_sd ?? "";

  return (
    <Card className="border-border overflow-hidden group">
      <CardContent className="p-0">
        <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
          {!playing && (
            <Image
              src={video.cover || "/placeholder.svg"}
              alt={video.title || "TikTok"}
              fill
              className="object-cover"
              unoptimized
            />
          )}
          {playUrl && (
            <video
              ref={videoRef}
              src={playUrl}
              className={`absolute inset-0 w-full h-full object-cover ${playing ? "opacity-100" : "opacity-0"}`}
              loop
              playsInline
              onEnded={() => setPlaying(false)}
            />
          )}
          {video.duration > 0 && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded font-mono">
              {fmtDur(video.duration)}
            </div>
          )}
          {playUrl && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="rounded-full bg-white/90 p-3 shadow-lg">
                {playing
                  ? <Pause className="h-6 w-6 text-black" />
                  : <Play  className="h-6 w-6 text-black" />}
              </div>
            </button>
          )}
        </div>

        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            {video.author.avatar && (
              <Image
                src={video.author.avatar}
                alt={video.author.nickname}
                width={24}
                height={24}
                className="rounded-full"
                unoptimized
              />
            )}
            <span className="text-xs font-medium text-foreground truncate">
              @{video.author.unique_id}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {video.title}
          </p>

          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Play          className="h-3 w-3" />{fmtNum(video.stats.play)}</span>
            <span className="flex items-center gap-1"><Heart         className="h-3 w-3" />{fmtNum(video.stats.likes)}</span>
            <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{fmtNum(video.stats.comment)}</span>
          </div>

          <div className="flex gap-1.5 pt-1">
            {video.download.video_hd && (
              <Button
                size="sm"
                className="flex-1 h-8 text-xs"
                disabled={downloading === "hd"}
                onClick={() => downloadFile(video.download.video_hd!, `tiktok_${video.id}_hd.mp4`, "hd")}
              >
                {downloading === "hd"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><Video className="mr-1 h-3 w-3" />HD</>}
              </Button>
            )}
            {video.download.video_sd && !video.download.video_hd && (
              <Button
                size="sm"
                className="flex-1 h-8 text-xs"
                disabled={downloading === "sd"}
                onClick={() => downloadFile(video.download.video_sd!, `tiktok_${video.id}.mp4`, "sd")}
              >
                {downloading === "sd"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><Video className="mr-1 h-3 w-3" />SD</>}
              </Button>
            )}
            {video.download.audio && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs bg-transparent"
                disabled={downloading === "audio"}
                onClick={() => downloadFile(video.download.audio!, `tiktok_${video.id}_audio.mp3`, "audio")}
              >
                {downloading === "audio"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><Music className="mr-1 h-3 w-3" />MP3</>}
              </Button>
            )}
          </div>
          {dlError && <p className="text-xs text-destructive">{dlError}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── API Key Tutorial Banner ──────────────────────────────────────── */
function ApiKeyTutorial({ lang, loggedIn }: { lang: string; loggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          {ts("how_to_get", lang)}
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-primary/20 pt-4">
          <ol className="space-y-3">
            {(["tutorial_step1", "tutorial_step2", "tutorial_step3"] as const).map((stepKey, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{ts(stepKey, lang)}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {ts(`${stepKey}_desc` as keyof typeof searchI18n, lang)}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-2 pt-1">
            {loggedIn ? (
              <Link href="/auth/profile">
                <Button size="sm" className="h-8 text-xs gap-1.5">
                  <Key className="h-3.5 w-3.5" />
                  {ts("go_profile", lang)}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="sm" className="h-8 text-xs gap-1.5">
                    {ts("go_register", lang)}
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                    <LogIn className="h-3.5 w-3.5" />
                    {ts("go_login", lang)}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main TikTokSearch component ─────────────────────────────────── */
export function TikTokSearch() {
  const { lang }                      = useLang();
  const [query, setQuery]             = useState("");
  const [apikey, setApikey]           = useState("");
  const [showKey, setShowKey]         = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [videos, setVideos]           = useState<SearchVideo[]>([]);
  const [cursor, setCursor]           = useState(0);
  const [hasMore, setHasMore]         = useState(false);
  const [lastQuery, setLastQuery]     = useState("");
  const [error, setError]             = useState("");
  const [loggedIn, setLoggedIn]       = useState(false);
  const [copied, setCopied]           = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setLoggedIn(true);
          // auto-fill API key from profile if available
          if (j.user?.api_key) setApikey(j.user.api_key);
        }
      })
      .catch(() => {});
  }, []);

  const doSearch = async (kw: string, cur: number, append = false) => {
    if (!kw.trim()) return;
    if (!apikey.trim()) { setError(ts("no_apikey", lang)); return; }
    append ? setLoadingMore(true) : setIsLoading(true);
    setError("");

    try {
      const res  = await fetch(
        `/api/v3/tiktok/search?q=${encodeURIComponent(kw)}&count=20&cursor=${cur}&apikey=${encodeURIComponent(apikey)}`
      );
      const json = await res.json();

      if (!json.success) {
        setError(json.error || t(tr.err.fetch_failed, lang));
        return;
      }

      setVideos((prev) => append ? [...prev, ...json.videos] : json.videos);
      setCursor(json.cursor ?? 0);
      setHasMore(json.has_more ?? false);
      setLastQuery(kw);
    } catch {
      setError(t(tr.err.fetch_failed, lang));
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVideos([]);
    setCursor(0);
    doSearch(query, 0);
  };

  const handleLoadMore = () => doSearch(lastQuery, cursor, true);

  const copyKey = async () => {
    if (!apikey) return;
    await navigator.clipboard.writeText(apikey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

      {/* API Key Tutorial */}
      <ApiKeyTutorial lang={lang} loggedIn={loggedIn} />

      <Card className="border-2 border-border shadow-lg">
        <CardContent className="p-4 md:p-6 space-y-3">

          {/* API Key input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5" />
              {ts("apikey_label", lang)}
            </label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={apikey}
                onChange={(e) => { setApikey(e.target.value); setError(""); }}
                placeholder={ts("apikey_placeholder", lang)}
                className="h-10 pr-20 text-sm font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {apikey && (
                  <button
                    type="button"
                    onClick={copyKey}
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs p-1"
                    title="Copy"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs"
                >
                  {showKey ? ts("hide", lang) : ts("show", lang)}
                </button>
              </div>
            </div>
          </div>

          {/* Search input + button */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError(""); }}
                placeholder={t(tr.search.placeholder, lang)}
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="h-12 px-8 text-base font-semibold">
              {isLoading
                ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t(tr.search.searching, lang)}</>
                : <><Search className="mr-2 h-5 w-5" />{t(tr.search.btn, lang)}</>}
            </Button>
          </form>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
              <p className="text-sm text-destructive font-medium">{error}</p>
              {!apikey && (
                <Link href="/auth/register" className="ml-auto flex-shrink-0">
                  <Button size="sm" variant="outline" className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10">
                    {ts("go_register", lang)}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[9/16] bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && videos.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground text-center">
            {videos.length} {t(tr.search.results, lang)} <strong className="text-foreground">&quot;{lastQuery}&quot;</strong>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {videos.map((v) => <VideoCard key={v.id ?? Math.random()} video={v} apikey={apikey} />)}
          </div>
          {hasMore && (
            <div className="text-center pt-2">
              <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore} className="px-8">
                {loadingMore
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t(tr.search.loading_more, lang)}</>
                  : t(tr.search.load_more, lang)}
              </Button>
            </div>
          )}
        </>
      )}

      {!isLoading && lastQuery && videos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="mx-auto h-10 w-10 mb-3 opacity-30" />
          <p>{t(tr.search.no_results, lang)}</p>
        </div>
      )}
    </div>
  );
}
