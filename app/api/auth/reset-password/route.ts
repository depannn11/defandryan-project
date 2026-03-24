// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readUserFile, writeUserFile } from "@/lib/pterodactyl";
import { hashPassword } from "@/lib/auth";
import { createOtp, verifyOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import type { User } from "@/lib/auth";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const visible = local.slice(0, Math.min(3, local.length));
  return `${visible}***@${domain}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { step } = body as { step: "request" | "verify" };

    // ── STEP 1: kirim OTP ke email ────────────────────────────────────────────
    if (step === "request") {
      const { username } = body as { username: string };

      if (!username)
        return NextResponse.json({ error: "Username wajib diisi." }, { status: 400 });

      const data = await readUserFile(`${username.toLowerCase()}.json`) as User | null;
      if (!data)
        return NextResponse.json({ error: "Username tidak ditemukan." }, { status: 404 });

      const { token, otp } = await createOtp(data.email, "login");

      const sent = await sendOtpEmail(data.email, otp, "login");
      if (!sent.success)
        return NextResponse.json({ error: "Gagal mengirim email. Coba lagi." }, { status: 500 });

      return NextResponse.json({
        success: true,
        token,
        maskedEmail: maskEmail(data.email),
      });
    }

    // ── STEP 2: verifikasi OTP + ganti password ───────────────────────────────
    if (step === "verify") {
      const { token, otp, username, newPassword } = body as {
        token: string;
        otp: string;
        username: string;
        newPassword: string;
      };

      if (!token || !otp || !username || !newPassword)
        return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });

      if (newPassword.length < 6)
        return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });

      const result = await verifyOtp(token, otp);
      if (!result.valid)
        return NextResponse.json({ error: result.error }, { status: 400 });

      const data = await readUserFile(`${username.toLowerCase()}.json`) as User | null;
      if (!data)
        return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

      const newHash = await hashPassword(newPassword);
      const updated = { ...data, password: newHash };

      const saved = await writeUserFile(`${username.toLowerCase()}.json`, updated as unknown as Record<string, unknown>);
      if (!saved)
        return NextResponse.json({ error: "Gagal menyimpan. Coba lagi." }, { status: 500 });

      return NextResponse.json({ success: true, message: "Password berhasil direset." });
    }

    return NextResponse.json({ error: "Step tidak valid." }, { status: 400 });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
