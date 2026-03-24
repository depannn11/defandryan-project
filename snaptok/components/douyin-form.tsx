"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download, Link as LinkIcon, Clipboard, Loader2,
  Video, Music, X, Check, Play, Heart,
  MessageCircle, Share2, ChevronLeft, ChevronRight,
  Images, ArrowDownToLine,
} from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

interface DouyinData {
  id: string;
  title: string;
  cover: string;
  duration: number;
  author: { nickname: string; unique_id: string; avatar: string };
  stats: { play: number; likes: number; comment: number; share: number };
  music: { title: string; author: string } | null;
  download: {
    video: string | null;
    video_hd: string | null;
    audio: string | null;
    images: string[] | null;
  };
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
function fmtDur(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`; }

function extractDouyinUrl(text: string): string {
  const m = text.match(/https?:\/\/(?:www\.)?(?:douyin\.com|v\.douyin\.com)[^\s]*/i);
  return m ? m[0] : text.trim();
}

/* ── Swipeable slide gallery (same interaction as TikTok slide) ── */
function DouyinSlideGallery({ images, audio, lang }: { images: string[]; audio: string | null; lang: string }) {
  const [current, setCurrent]       = useState(0);
  const [downloaded, setDownloaded] = useState<Set<number>>(new Set());
  const [dlAll, setDlAll]           = useState(false);
  const touchStart                  = useRef<number | null>(null);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  const downloadOne = async (idx: number) => {
    try {
      const blob    = await fetch(images[idx]).then((r) => r.blob());
      const blobUrl = URL.createObjectURL(blob);
      const a       = Object.assign(document.createElement("a"), { href: blobUrl, download: `douyin_photo_${idx + 1}.jpg` });
      document.body.appendChild(a); a.click();
      URL.revokeObjectURL(blobUrl); a.remove();
      setDownloaded((d) => new Set(d).add(idx));
    } catch {}
  };

  const downloadAll = async () => {
    setDlAll(true);
    for (let i = 0; i < images.length; i++) {
      await downloadOne(i);
      await new Promise((r) => setTimeout(r, 300));
    }
    setDlAll(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-red-400 font-medium">
          <Images className="h-4 w-4" />
          {images.length} 张图片 · 向左滑动浏览
        </span>
        <span className="text-xs text-muted-foreground">{current + 1}/{images.length}</span>
      </div>
      {/* Gallery */}
      <div
        className="relative overflow-hidden rounded-xl border-2 border-red-200 dark:border-red-900 bg-black"
        style={{ aspectRatio: "3/4", maxHeight: 480 }}
        onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
          touchStart.current = null;
        }}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)`, width: `${images.length * 100}%` }}
        >
          {images.map((img, i) => (
            <div key={i} className="relative flex-shrink-0" style={{ width: `${100 / images.length}%` }}>
              <Image src={img} alt={`抖音图片 ${i + 1}`} fill className="object-contain" unoptimized />
              <button
                onClick={() => downloadOne(i)}
                className="absolute inset-0 flex flex-col items-center justify-end pb-5 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 active:opacity-100 transition-opacity"
              >
                <div className={`rounded-full p-3 shadow-lg ${downloaded.has(i) ? "bg-green-500" : "bg-white/90"}`}>
                  {downloaded.has(i) ? <Check className="h-6 w-6 text-white" /> : <ArrowDownToLine className="h-6 w-6 text-black" />}
                </div>
              </button>
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 p-2 text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 p-2 text-white">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all ${i === current ? "w-5 h-2 bg-red-500" : "w-2 h-2 bg-muted-foreground/30"}`} />
        ))}
      </div>
      {/* Thumbs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`relative flex-shrink-0 w-14 h-18 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-red-500" : "border-border"}`}
            style={{ height: 72 }}>
            <Image src={img} alt="" fill className="object-cover" unoptimized />
            {downloaded.has(i) && (
              <div className="absolute inset-0 bg-green-500/60 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      {/* Action btns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button onClick={downloadAll} disabled={dlAll} className="gap-2 bg-red-600 hover:bg-red-700 text-white">
          {dlAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          下载全部 ({images.length}) · Download All
        </Button>
        {audio && (
          <Button variant="outline" className="gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 bg-transparent"
            onClick={async () => {
              const blob = await fetch(audio).then((r) => r.blob());
              const u = URL.createObjectURL(blob);
              const a = Object.assign(document.createElement("a"), { href: u, download: "douyin_audio.mp3" });
              document.body.appendChild(a); a.click(); URL.revokeObjectURL(u); a.remove();
            }}>
            <Music className="h-4 w-4" />
            {t(tr.dl.audio, lang)}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Main DouyinForm ── */
export function DouyinForm() {
  const { lang }                      = useLang();
  const [url, setUrl]                 = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [videoData, setVideoData]     = useState<DouyinData | null>(null);
  const [error, setError]             = useState("");
  const [pasted, setPasted]           = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(extractDouyinUrl(text));
      setPasted(true); setError("");
      setTimeout(() => setPasted(false), 2000);
    } catch { setError(t(tr.err.clipboard, lang)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = extractDouyinUrl(url);
    if (!clean) { setError(t(tr.err.enter_url_dy, lang)); return; }
    if (!clean.includes("douyin.com")) { setError(t(tr.err.invalid_url_dy, lang)); return; }
    setIsLoading(true); setError(""); setVideoData(null);
    try {
      const res  = await fetch(`/api/v3/download?platform=douyin&url=${encodeURIComponent(clean)}`, {
        headers: { "X-Internal-Request": "1" },
      });
      const json = await res.json();
      if (!json.success) { setError(json.error || t(tr.err.fetch_failed, lang)); return; }
      setVideoData(json.data as DouyinData);
    } catch { setError(t(tr.err.fetch_failed, lang)); }
    finally { setIsLoading(false); }
  };

  const downloadFile = async (dlUrl: string, filename: string, key: string) => {
    setDownloading(key);
    try {
      const blob = await fetch(dlUrl).then((r) => r.blob());
      const blobUrl = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: blobUrl, download: filename });
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(blobUrl); a.remove();
    } catch { setError(t(tr.err.dl_failed, lang)); }
    finally { setDownloading(null); }
  };

  const isSlide = videoData?.download?.images && videoData.download.images.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input card — red themed */}
      <div className="rounded-2xl border-2 border-red-200 dark:border-red-900 bg-card shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-white font-bold text-sm">抖音下载 · Douyin Downloader</span>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button type="button" variant="secondary" onClick={handlePaste}
              className="w-full sm:w-auto border border-red-200 dark:border-red-800">
              {pasted
                ? <><Check className="mr-2 h-4 w-4 text-green-500" />{t(tr.ui.pasted, lang)}</>
                : <><Clipboard className="mr-2 h-4 w-4 text-red-500" />{t(tr.ui.paste, lang)}</>}
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-400" />
                <Input
                  type="text" value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  placeholder={t(tr.douyin_home.placeholder, lang)}
                  className="h-12 pl-10 text-base border-red-200 dark:border-red-800 focus-visible:ring-red-500"
                />
              </div>
              <Button type="submit" disabled={isLoading}
                className="h-12 px-8 font-semibold bg-red-600 hover:bg-red-700 text-white">
                {isLoading
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t(tr.ui.processing, lang)}</>
                  : <><Download className="mr-2 h-5 w-5" />{t(tr.ui.download_now, lang)}</>}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          </form>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center py-16 gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-xl">🎬</span>
          </div>
          <p className="text-muted-foreground animate-pulse">{t(tr.ui.processing_video, lang)}</p>
        </div>
      )}

      {/* Result */}
      {videoData && !isLoading && (
        <div className="rounded-2xl border-2 border-red-200 dark:border-red-900 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-red-600/10 to-transparent border-b border-red-100 dark:border-red-900 px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-red-600 flex items-center gap-2">
              <span>🎬</span>{t(tr.ui.result_title, lang)}
            </span>
            <button onClick={() => { setVideoData(null); setUrl(""); setError(""); }} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className={`${isSlide ? "p-4" : "flex flex-col md:flex-row"}`}>
            {!isSlide && (
              /* Video thumbnail */
              <div className="relative w-full md:w-52 h-64 md:h-auto flex-shrink-0">
                <Image src={videoData.cover || "/placeholder.svg"} alt={videoData.title || "Douyin"} fill className="object-cover" unoptimized />
                {videoData.duration > 0 && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded font-mono">
                    {fmtDur(videoData.duration)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-transparent" />
              </div>
            )}

            <div className={`${isSlide ? "" : "flex-1 p-4"}`}>
              {/* Author */}
              <div className="flex items-center gap-3 mb-3">
                <Image src={videoData.author?.avatar || "/placeholder.svg"} alt={videoData.author?.nickname || ""} width={40} height={40} className="rounded-full border-2 border-red-300" unoptimized />
                <div>
                  <p className="font-semibold text-foreground">{videoData.author?.nickname}</p>
                  <p className="text-xs text-muted-foreground">@{videoData.author?.unique_id}</p>
                </div>
              </div>
              {videoData.title && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{videoData.title}</p>}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Play className="h-3.5 w-3.5 text-red-400" />{fmtNum(videoData.stats?.play ?? 0)}</span>
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-red-400" />{fmtNum(videoData.stats?.likes ?? 0)}</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5 text-red-400" />{fmtNum(videoData.stats?.comment ?? 0)}</span>
                <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5 text-red-400" />{fmtNum(videoData.stats?.share ?? 0)}</span>
              </div>

              {/* Slide gallery or video buttons */}
              {isSlide ? (
                <DouyinSlideGallery
                  images={videoData.download.images!}
                  audio={videoData.download.audio}
                  lang={lang}
                />
              ) : (
                <div className="space-y-2">
                  {(videoData.download.video_hd || videoData.download.video) && (
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
                      onClick={() => downloadFile(
                        (videoData.download.video_hd || videoData.download.video)!,
                        `douyin_${videoData.id ?? "video"}_hd.mp4`, "hd"
                      )}
                      disabled={downloading === "hd"}
                    >
                      {downloading === "hd" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                      {t(tr.dl.video_no_wm, lang)}
                    </Button>
                  )}
                  {videoData.download.audio && (
                    <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 bg-transparent gap-2"
                      onClick={() => downloadFile(videoData.download.audio!, `douyin_audio.mp3`, "audio")}
                      disabled={downloading === "audio"}
                    >
                      {downloading === "audio" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
                      {t(tr.dl.audio, lang)}
                    </Button>
                  )}
                  {videoData.music && (
                    <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 flex items-center gap-2">
                      <Music className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{videoData.music.title} — {videoData.music.author}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}