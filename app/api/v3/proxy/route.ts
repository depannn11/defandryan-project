// app/api/v3/proxy/route.ts
// Server-side proxy — bypass CORS untuk download & streaming video dari CDN TikTok/Douyin
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_DOMAINS = [
  "tikwm.com",
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "tiktokv.com",
  "tiktokv.us",
  "musical.ly",
  "365yg.com",
  "douyinpic.com",
  "douyinvod.com",
  "byteimg.com",
  "bytedance.com",
  "snssdk.com",
  "amemv.com",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return NextResponse.json({ error: "Parameter 'url' wajib diisi." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(fileUrl);
  } catch {
    return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
  }

  const isAllowed = ALLOWED_DOMAINS.some(
    (d) => parsedUrl.hostname === d || parsedUrl.hostname.endsWith("." + d)
  );
  if (!isAllowed) {
    return NextResponse.json({ error: "Domain tidak diizinkan." }, { status: 403 });
  }

  // Forward Range header supaya video player bisa streaming / seek
  const upstreamHeaders: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
    "Referer":    "https://www.tiktok.com/",
    "Origin":     "https://www.tiktok.com",
  };
  const rangeHeader = req.headers.get("range");
  if (rangeHeader) upstreamHeaders["Range"] = rangeHeader;

  try {
    const upstream = await fetch(fileUrl, { headers: upstreamHeaders });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status}` },
        { status: 502 }
      );
    }

    const contentType   = upstream.headers.get("content-type")    ?? "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");
    const contentRange  = upstream.headers.get("content-range");
    const acceptRanges  = upstream.headers.get("accept-ranges");

    const resHeaders = new Headers({
      "Content-Type":                contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control":               "no-store",
    });
    if (contentLength) resHeaders.set("Content-Length",  contentLength);
    if (contentRange)  resHeaders.set("Content-Range",   contentRange);
    if (acceptRanges)  resHeaders.set("Accept-Ranges",   acceptRanges);

    return new NextResponse(upstream.body, {
      status:  upstream.status, // 200 atau 206 (partial)
      headers: resHeaders,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil file dari upstream." },
      { status: 500 }
    );
  }
}
