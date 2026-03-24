import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET  = new TextEncoder().encode("snaptok-jwt-secret-2026-defandryan");
const COOKIE_NAME = "snaptok_session";

const VALID_LANGS = ["en", "id", "ru", "zh", "ar"];

async function getSession(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch { return null; }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/docs" || pathname.startsWith("/docs/")) {
    const session = await getSession(req);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/auth/profile")) {
    const session = await getSession(req);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    const session = await getSession(req);
    if (session) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/profile";
      return NextResponse.redirect(url);
    }
  }

  const langMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (langMatch) {
    const lang = langMatch[1];
    if (!VALID_LANGS.includes(lang)) {
      return NextResponse.next();
    }
    const res = NextResponse.next();
    res.cookies.set("lang", lang, { path: "/", maxAge: 31536000 });
    return res;
  }

  if (pathname.startsWith("/api/v3/")) {
    if (pathname.startsWith("/api/v3/proxy")) return NextResponse.next();

    const url     = req.nextUrl;
    const apikey  = url.searchParams.get("apikey") ?? req.headers.get("x-api-key") ?? "";
    const origin  = req.headers.get("origin") ?? "";
    const referer = req.headers.get("referer") ?? "";

    const isWeb =
      req.headers.get("x-internal-request") === "1" ||
      origin.includes("snaptok.my.id") ||
      origin.includes("localhost") ||
      referer.includes("snaptok.my.id") ||
      referer.includes("localhost");

    if (isWeb) return NextResponse.next();

    if (!apikey || !apikey.startsWith("snp-")) {
      return NextResponse.json(
        {
          success: false,
          error: "An API key is required. Add ?apikey=snp-xxxxx or the X-API-Key header.",
          docs: "https://www.snaptok.my.id/docs",
        },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
