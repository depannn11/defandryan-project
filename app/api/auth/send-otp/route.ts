// app/api/auth/send-otp/route.ts
// Dipakai untuk: register (kirim OTP + simpan pending data) dan login (kirim OTP)
import { NextRequest, NextResponse } from "next/server";
import { readUserFile } from "@/lib/pterodactyl";
import { hashPassword, generateApiKey, verifyPassword } from "@/lib/auth";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import type { User } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body as { type: "register" | "login" };

    // ── REGISTER ─────────────────────────────────────────────────────────────
    if (type === "register") {
      const { username, email, password } = body as {
        username: string; email: string; password: string;
      };

      if (!username || !email || !password)
        return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
      if (username.length < 3 || username.length > 20)
        return NextResponse.json({ error: "Username harus 3-20 karakter." }, { status: 400 });
      if (!/^[a-zA-Z0-9_]+$/.test(username))
        return NextResponse.json({ error: "Username hanya boleh huruf, angka, dan underscore." }, { status: 400 });
      if (password.length < 6)
        return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });

      // Cek username sudah ada
      const existing = await readUserFile(`${username.toLowerCase()}.json`);
      if (existing)
        return NextResponse.json({ error: "Username sudah dipakai." }, { status: 400 });

      const passwordHash = await hashPassword(password);
      const apikey       = generateApiKey();

      const { token, otp } = await createOtp(email, "register", {
        username: username.toLowerCase(),
        passwordHash,
        apikey,
      });

      const sent = await sendOtpEmail(email, otp, "register");
      if (!sent.success)
        return NextResponse.json({ error: "Gagal mengirim email. Coba lagi." }, { status: 500 });

      return NextResponse.json({ success: true, token, message: `Kode verifikasi dikirim ke ${email}` });
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    if (type === "login") {
      const { username, password } = body as { username: string; password: string };

      if (!username || !password)
        return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });

      const data = await readUserFile(`${username.toLowerCase()}.json`) as User | null;
      if (!data)
        return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });

      const ok = await verifyPassword(password, data.password);
      if (!ok)
        return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });

      const { token, otp } = await createOtp(data.email, "login");

      const sent = await sendOtpEmail(data.email, otp, "login");
      if (!sent.success)
        return NextResponse.json({ error: "Gagal mengirim email. Coba lagi." }, { status: 500 });

      // Kembalikan email yang sudah di-mask untuk ditampilkan di UI
      const maskedEmail = maskEmail(data.email);
      return NextResponse.json({
        success: true,
        token,
        maskedEmail,
        message: `Kode verifikasi dikirim ke ${maskedEmail}`,
      });
    }

    return NextResponse.json({ error: "Type tidak valid." }, { status: 400 });
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const visible = local.slice(0, Math.min(3, local.length));
  return `${visible}***@${domain}`;
}
