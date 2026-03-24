// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { writeUserFile, readUserFile } from "@/lib/pterodactyl";
import { createSession, addToApiKeyIndex, COOKIE_NAME } from "@/lib/auth";
import type { User, SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token, otp } = await req.json() as { token: string; otp: string };

    if (!token || !otp)
      return NextResponse.json({ error: "Token dan kode wajib diisi." }, { status: 400 });

    const result = await verifyOtp(token, otp);
    if (!result.valid)
      return NextResponse.json({ error: result.error }, { status: 400 });

    const { record } = result;

    // ── REGISTER — buat user baru ─────────────────────────────────────────────
    if (record.type === "register") {
      if (!record.pending)
        return NextResponse.json({ error: "Data pendaftaran tidak ditemukan." }, { status: 400 });

      const { username, passwordHash, apikey } = record.pending;

      // Double-check: username belum dipakai (race condition)
      const existing = await readUserFile(`${username}.json`);
      if (existing)
        return NextResponse.json({ error: "Username sudah dipakai." }, { status: 400 });

      const user: User = {
        username,
        email:    record.email,
        password: passwordHash,
        avatar:   "",
        apikey,
        created:  new Date().toISOString(),
        plan:     "free",
        requests: 0,
      };

      const saved = await writeUserFile(`${username}.json`, user as unknown as Record<string, unknown>);
      if (!saved)
        return NextResponse.json({ error: "Gagal menyimpan akun. Coba lagi." }, { status: 500 });

      await addToApiKeyIndex(apikey, username);

      // Simpan email → username index untuk keperluan OTP login
      const emailIndex = await readUserFile("_email_index.json") as Record<string, string> | null ?? {};
      emailIndex[record.email] = username;
      await writeUserFile("_email_index.json", emailIndex);

      const sessionUser: SessionUser = {
        username: user.username,
        email:    user.email,
        avatar:   user.avatar,
        apikey:   user.apikey,
        plan:     user.plan,
      };

      const sessionToken = await createSession(sessionUser);
      const res = NextResponse.json({ success: true, user: sessionUser });
      res.cookies.set(COOKIE_NAME, sessionToken, {
        httpOnly: true, secure: true, sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, path: "/",
      });
      return res;
    }

    // ── LOGIN — buat session untuk user yang sudah ada ────────────────────────
    if (record.type === "login") {
      const emailIndex = await readUserFile("_email_index.json") as Record<string, string> | null ?? {};
      const username   = emailIndex[record.email];

      if (!username)
        return NextResponse.json({ error: "Data user tidak ditemukan. Coba login ulang." }, { status: 400 });

      const data = await readUserFile(`${username}.json`) as User | null;
      if (!data)
        return NextResponse.json({ error: "User tidak ditemukan." }, { status: 400 });

      const sessionUser: SessionUser = {
        username: data.username,
        email:    data.email,
        avatar:   data.avatar,
        apikey:   data.apikey,
        plan:     data.plan,
      };

      const sessionToken = await createSession(sessionUser);
      const res = NextResponse.json({ success: true, user: sessionUser });
      res.cookies.set(COOKIE_NAME, sessionToken, {
        httpOnly: true, secure: true, sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, path: "/",
      });
      return res;
    }

    return NextResponse.json({ error: "Type tidak valid." }, { status: 400 });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
