// app/api/v3/tiktok/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, incrementRequests, extractApiKey } from "@/lib/apikey";

function errRes(message: string, status = 400, extra?: object) {
  return NextResponse.json({ success: false, error: message, ...extra }, { status });
}
function proxy(url: string | null | undefined): string | null {
  if (!url) return null;
  return `/api/v3/proxy?url=${encodeURIComponent(url)}`;
}

export async function GET(req: NextRequest) {
  // ── API Key validation ────────────────────────────────────────────────────
  const apikey = extractApiKey(req);
  const auth   = await validateApiKey(apikey);
  if (!auth.valid) return errRes(auth.error ?? "API key tidak valid.", 401, { docs: "https://www.snaptok.my.id/docs" });

  const { searchParams } = new URL(req.url);
  const q      = searchParams.get("q")?.trim();
  const count  = Math.min(Number(searchParams.get("count")  ?? 20), 50);
  const cursor = Number(searchParams.get("cursor") ?? 0);

  if (!q) return errRes("Parameter 'q' wajib diisi.", 400, {
    example: "https://www.snaptok.my.id/api/v3/tiktok/search?q=funny+cats&count=20&cursor=0&apikey=snp-xxx",
  });

  try {
    const body = new URLSearchParams({ keywords: q, count: String(count), cursor: String(cursor), HD: "1" });
    const res  = await fetch("https://tikwm.com/api/feed/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie":       "current_language=en",
        "User-Agent":   "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
      body: body.toString(),
    });
    const json   = await res.json();
    const videos = json?.data?.videos;
    if (!videos || videos.length === 0) return errRes("Tidak ada video ditemukan untuk keyword tersebut.");

    await incrementRequests(auth.username!);
    return NextResponse.json({
      success: true, query: q, count: videos.length,
      cursor: json?.data?.cursor ?? 0, has_more: json?.data?.has_more ?? false,
      videos: videos.map((v: Record<string, unknown>) => {
        const author = (v.author ?? {}) as Record<string, string>;
        return {
          id: (v.video_id ?? v.id ?? null) as string | null,
          title: (v.title ?? "") as string, cover: (v.cover ?? "") as string, duration: (v.duration ?? 0) as number,
          author: { nickname: author.nickname ?? "", unique_id: author.unique_id ?? "", avatar: author.avatar ?? "" },
          stats: { play: (v.play_count ?? 0) as number, likes: (v.digg_count ?? 0) as number, comment: (v.comment_count ?? 0) as number, share: (v.share_count ?? 0) as number },
          download: {
            video_hd:        proxy((v.hdplay ?? v.play) as string),
            video_sd:        proxy(v.play  as string),
            video_watermark: proxy(v.wmplay as string),
            audio:           proxy(v.music  as string),
          },
        };
      }),
    });
  } catch { return errRes("Terjadi kesalahan server saat mencari video.", 500); }
}
