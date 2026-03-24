"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download, Link as LinkIcon, Clipboard, Loader2,
  Video, Music, X, CheckCircle2, Play, Heart,
  MessageCircle, Share2, Check, Search, Images,
} from "lucide-react";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

interface TikTokData {
  id: string;
  title: string;
  cover: string;
  duration: number;
  author: { nickname: string; unique_id: string; avatar: string };
  stats:  { play: number; likes: number; comment: number; share: number };
  music:  { title: string; author: string } | null;
  download: {
    video_hd:        string | null;
    video_sd:        string | null;
    video_watermark: string | null;
    audio:           string | null;
    images:          string[] | null;
  };
}

function extractTikTokUrl(text: string): string {
  const m = text.match(/https?:\/\/(?:www\.)?(?:tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)[^\s]*/i);
  return m ? m[0] : text.trim();
}
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
function fmtDur(sec: number): string {
  return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;
}

export function DownloadForm() {
  const { lang } = useLang();
  const pathname = usePathname();
  const isSearch = pathname?.includes("tiktok-search");
  const [url, setUrl]                 = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [videoData, setVideoData]     = useState<TikTokData | null>(null);
  const [error, setError]             = useState("");
  const [pasted, setPasted]           = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(extractTikTokUrl(text));
      setPasted(true); setError("");
      setTimeout(() => setPasted(false), 2000);
    } catch { setError(t(tr.err.clipboard, lang)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = extractTikTokUrl(url);
    if (!clean) { setError(t(tr.err.enter_url, lang)); return; }
    if (!clean.includes("tiktok.com") && !clean.includes("vt.tiktok")) {
      setError(t(tr.err.invalid_url, lang)); return;
    }
    setIsLoading(true); setError(""); setVideoData(null);
    try {
      const res  = await fetch(`/api/v3/download?platform=tiktok&url=${encodeURIComponent(clean)}`, {
        headers: { "X-Internal-Request": "1" },
      });
      const json = await res.json();
      if (!json.success) setError(json.error || t(tr.err.fetch_failed, lang));
      else setVideoData(json.data as TikTokData);
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

  const clearResult = () => { setVideoData(null); setUrl(""); setError(""); };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode nav */}
      <div className="flex items-center justify-center gap-1 rounded-full border border-border bg-muted p-1 w-fit mx-auto">
        <Link
          href="/"
          prefetch={true}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            !isSearch
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
          }`}
        >
          <Download className="h-3.5 w-3.5" />
          {t(tr.search.tab_download, lang)}
        </Link>
        <Link
          href="/tiktok-search"
          prefetch={true}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            isSearch
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          {t(tr.search.tab_search, lang)}
        </Link>
      </div>

      {/* Input card */}
      <Card className="border-2 border-border shadow-lg">
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button type="button" variant="secondary" onClick={handlePaste} className="w-full md:w-auto">
              {pasted ? <><Check className="mr-2 h-4 w-4 text-green-500" />{t(tr.ui.pasted, lang)}</>
                      : <><Clipboard className="mr-2 h-4 w-4" />{t(tr.ui.paste, lang)}</>}
            </Button>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input type="text" value={url} onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  placeholder={t(tr.tiktok_home.placeholder, lang)} className="h-12 pl-10 text-base" />
              </div>
              <Button type="submit" disabled={isLoading} className="h-12 px-8 text-base font-semibold">
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t(tr.ui.processing, lang)}</>
                           : <><Download className="mr-2 h-5 w-5" />{t(tr.ui.download_now, lang)}</>}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setUrl("https://vt.tiktok.com/ZSYxX1X1X/")} className="rounded-full bg-transparent">
          <LinkIcon className="mr-2 h-4 w-4" />{t(tr.ui.example_link, lang)}
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-full bg-transparent">
          <Link href="/guide"><CheckCircle2 className="mr-2 h-4 w-4" />{t(tr.ui.how_it_works, lang)}</Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-full bg-transparent">
          <Link href="/faq"><CheckCircle2 className="mr-2 h-4 w-4" />{t(tr.ui.help, lang)}</Link>
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <Card className="border-2 border-border">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">{t(tr.ui.processing_video, lang)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {videoData && !isLoading && (
        <Card className="border-2 border-border shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-bold">{t(tr.ui.result_title, lang)}</h3>
              <Button variant="ghost" size="icon" onClick={clearResult}><X className="h-5 w-5" /></Button>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-56 h-72 md:h-auto flex-shrink-0">
                <Image src={videoData.cover || "/placeholder.svg"} alt={videoData.title || "TikTok"} fill className="object-cover" unoptimized />
                {videoData.duration > 0 && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">{fmtDur(videoData.duration)}</div>
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Image src={videoData.author.avatar || "/placeholder.svg"} alt={videoData.author.nickname} width={44} height={44} className="rounded-full" unoptimized />
                  <div>
                    <p className="font-semibold text-foreground">{videoData.author.nickname}</p>
                    <p className="text-sm text-muted-foreground">@{videoData.author.unique_id}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground line-clamp-2 mb-3">{videoData.title || "Video TikTok"}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Play className="h-4 w-4" />{fmtNum(videoData.stats.play)}</span>
                  <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{fmtNum(videoData.stats.likes)}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{fmtNum(videoData.stats.comment)}</span>
                  <span className="flex items-center gap-1"><Share2 className="h-4 w-4" />{fmtNum(videoData.stats.share)}</span>
                </div>
                <div className="space-y-2">
                  {videoData.download.images && videoData.download.images.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t(tr.dl.slideshow, lang)} ({videoData.download.images.length} {t(tr.dl.images, lang)})
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-2 border rounded-md bg-muted/20">
                        {videoData.download.images.map((img, i) => (
                          <button key={i} onClick={() => downloadFile(img, `tiktok_slide_${i+1}.jpg`, `img-${i}`)} disabled={downloading === `img-${i}`}
                            className="group relative aspect-square overflow-hidden rounded-md border border-border hover:ring-2 hover:ring-primary transition-all">
                            <Image src={img} alt={`Slide ${i+1}`} fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              {downloading === `img-${i}` ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <Download className="h-6 w-6 text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                      {videoData.download.audio && (
                        <Button variant="outline" onClick={() => downloadFile(videoData.download.audio!, `tiktok_${videoData.id}_audio.mp3`, "audio")} disabled={downloading === "audio"} className="w-full bg-transparent">
                          {downloading === "audio" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Music className="mr-2 h-4 w-4" />}
                          {t(tr.dl.audio, lang)}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {videoData.download.video_hd && (
                          <Button onClick={() => downloadFile(videoData.download.video_hd!, `tiktok_${videoData.id}_hd.mp4`, "hd")} disabled={downloading === "hd"} className="flex-1">
                            {downloading === "hd" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                            {t(tr.dl.hd_no_wm, lang)}
                          </Button>
                        )}
                        {videoData.download.video_sd && (
                          <Button variant="secondary" onClick={() => downloadFile(videoData.download.video_sd!, `tiktok_${videoData.id}.mp4`, "sd")} disabled={downloading === "sd"} className="flex-1">
                            {downloading === "sd" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                            {t(tr.dl.sd_no_wm, lang)}
                          </Button>
                        )}
                      </div>
                      {videoData.download.video_watermark && (
                        <Button variant="outline" onClick={() => downloadFile(videoData.download.video_watermark!, `tiktok_${videoData.id}_wm.mp4`, "wm")} disabled={downloading === "wm"} className="w-full bg-transparent">
                          {downloading === "wm" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                          {t(tr.dl.with_wm, lang)}
                        </Button>
                      )}
                      {videoData.download.audio && (
                        <Button variant="outline" onClick={() => downloadFile(videoData.download.audio!, `tiktok_${videoData.id}_audio.mp3`, "audio")} disabled={downloading === "audio"} className="w-full bg-transparent">
                          {downloading === "audio" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Music className="mr-2 h-4 w-4" />}
                          {t(tr.dl.audio, lang)}
                        </Button>
                      )}
                    </>
                  )}
                </div>
                {videoData.music && (
                  <div className="mt-3 p-2 bg-muted rounded-lg flex items-center gap-2">
                    <Music className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{videoData.music.title} — {videoData.music.author}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
