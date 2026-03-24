// app/api/v3/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { validateApiKey, incrementRequests, extractApiKey } from "@/lib/apikey";

const DOUYIN_ENDPOINT = "https://api.seekin.ai/ikool/media/download";
const DOUYIN_SECRET   = "3HT8hjE79L";

function sortAndStringify(obj: Record<string, string>): string {
  if (!obj || typeof obj !== "object") return "";
  return Object.keys(obj).sort().map((k) => `${k}=${obj[k]}`).join("&");
}
function buildDouyinHeaders(body: Record<string, string>): Record<string, string> {
  const lang = "en", timestamp = Date.now().toString();
  const raw  = `${lang}${timestamp}${DOUYIN_SECRET}${sortAndStringify(body)}`;
  const sign = createHash("sha256").update(raw).digest("hex");
  return {
    "accept": "*/*", "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json", "lang": lang,
    "origin": "https://www.seekin.ai", "referer": "https://www.seekin.ai/",
    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
    "sign": sign, "timestamp": timestamp,
  };
}
function errRes(message: string, status = 400, extra?: object) {
  return NextResponse.json({ success: false, error: message, ...extra }, { status });
}
function proxy(u: string | null | undefined): string | null {
  return u ? `/api/v3/proxy?url=${encodeURIComponent(u)}` : null;
}

export async function GET(req: NextRequest) {
  const origin   = req.headers.get("origin") ?? "";
  const referer  = req.headers.get("referer") ?? "";
  const isWeb =
    req.headers.get("x-internal-request") === "1" ||
    origin.includes("snaptok.my.id") ||
    origin.includes("localhost") ||
    referer.includes("snaptok.my.id") ||
    referer.includes("localhost");

  let apiUsername: string | undefined;

  if (!isWeb) {
    const apikey = extractApiKey(req);
    const auth   = await validateApiKey(apikey);
    if (!auth.valid)
      return errRes(auth.error ?? "API key tidak valid.", 401, { docs: "https://www.snaptok.my.id/docs" });
    apiUsername = auth.username;
  }

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform")?.toLowerCase();
  const videoUrl = searchParams.get("url");

  if (!platform || !["tiktok", "douyin"].includes(platform)) {
    return errRes("Parameter 'platform' wajib diisi. Nilai yang valid: tiktok | douyin", 400, {
      example: ["https://www.snaptok.my.id/api/v3/download?platform=tiktok&url=...&apikey=snp-xxx",
                "https://www.snaptok.my.id/api/v3/download?platform=douyin&url=...&apikey=snp-xxx"],
    });
  }
  if (!videoUrl) return errRes("Parameter 'url' wajib diisi.");

  // ── TikTok ────────────────────────────────────────────────────────────────
  if (platform === "tiktok") {
    const valid = videoUrl.includes("tiktok.com") || videoUrl.includes("vt.tiktok") || videoUrl.includes("vm.tiktok");
    if (!valid) return errRes("URL bukan URL TikTok yang valid.");
    try {
      const res  = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`);
      const json = await res.json();
      if (json.code !== 0 || !json.data) return errRes(json.msg || "Gagal mengambil data video TikTok.");
      const d = json.data;
      if (apiUsername) await incrementRequests(apiUsername);

      // Proxy semua URL agar tidak kena CORS di browser
      const images: string[] | null = Array.isArray(d.images) && d.images.length > 0
        ? d.images.map((img: string) => proxy(img)!)
        : null;

      return NextResponse.json({
        success: true, platform: "tiktok",
        data: {
          id: d.id ?? null, title: d.title ?? "", cover: d.cover ?? "", duration: d.duration ?? 0,
          author: { nickname: d.author?.nickname ?? "", unique_id: d.author?.unique_id ?? "", avatar: d.author?.avatar ?? "" },
          stats: { play: d.play_count ?? 0, likes: d.digg_count ?? 0, comment: d.comment_count ?? 0, share: d.share_count ?? 0 },
          music: d.music_info ? { title: d.music_info.title ?? "", author: d.music_info.author ?? "" } : null,
          download: {
            video_hd:        proxy(d.hdplay),
            video_sd:        proxy(d.play),
            video_watermark: proxy(d.wmplay),
            audio:           proxy(d.music),
            images,
          },
        },
      });
    } catch { return errRes("Terjadi kesalahan server saat mengambil data TikTok.", 500); }
  }

  // ── Douyin ────────────────────────────────────────────────────────────────
  if (platform === "douyin") {
    const valid = videoUrl.includes("douyin.com") || videoUrl.includes("v.douyin");
    if (!valid) return errRes("URL bukan URL Douyin yang valid.");
    try {
      const body = { url: videoUrl };
      const res  = await fetch(DOUYIN_ENDPOINT, { method: "POST", headers: buildDouyinHeaders(body), body: JSON.stringify(body) });
      const json = await res.json();
      if (!json.data) return errRes(json.msg || "Gagal mengambil data video Douyin.");
      const d = json.data;
      if (apiUsername) await incrementRequests(apiUsername);

      // Map images dari Douyin (array of photo objects or strings)
      let images: string[] | null = null;
      if (Array.isArray(d.images) && d.images.length > 0) {
        images = d.images.map((img: { url?: string } | string) =>
          proxy(typeof img === "string" ? img : img?.url ?? null)!
        ).filter(Boolean);
      } else if (Array.isArray(d.imageList) && d.imageList.length > 0) {
        images = d.imageList.map((img: { url?: string } | string) =>
          proxy(typeof img === "string" ? img : img?.url ?? null)!
        ).filter(Boolean);
      }

      return NextResponse.json({
        success: true, platform: "douyin",
        data: {
          id:       d.id ?? d.aweme_id ?? null,
          title:    d.title ?? d.desc ?? "",
          cover:    d.imageUrl ?? d.cover ?? d.origin_cover ?? "",
          duration: d.duration ?? d.video?.duration ?? 0,
          author: {
            nickname:  d.author?.nickname ?? d.nickname ?? "",
            unique_id: d.author?.unique_id ?? d.author?.uid ?? "",
            avatar:    d.author?.avatar ?? d.avatarThumb ?? "",
          },
          stats: {
            play:    d.statistics?.play_count    ?? d.playCount    ?? 0,
            likes:   d.statistics?.digg_count    ?? d.diggCount    ?? 0,
            comment: d.statistics?.comment_count ?? d.commentCount ?? 0,
            share:   d.statistics?.share_count   ?? d.shareCount   ?? 0,
          },
          music: d.music ? { title: d.music.title ?? "", author: d.music.author ?? "" } : null,
          download: {
            video:    proxy(d.medias?.[0]?.url ?? d.video?.play_addr?.url_list?.[0] ?? null),
            video_hd: proxy(d.medias?.[1]?.url ?? null),
            audio:    proxy(d.music ?? null),
            images,
          },
        },
      });
    } catch { return errRes("Terjadi kesalahan server saat mengambil data Douyin.", 500); }
  }
}
