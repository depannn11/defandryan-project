// app/api/auth/register/route.ts
// DEPRECATED: Registrasi sekarang menggunakan 2-step OTP flow:
//   1. POST /api/auth/send-otp  { type: "register", username, email, password }
//   2. POST /api/auth/verify-otp { token, otp }
// Route ini dijaga agar tidak break jika ada yang masih hit endpoint lama.
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({
    error: "Endpoint ini sudah tidak digunakan. Gunakan /api/auth/send-otp untuk mendaftar.",
    docs: "https://www.snaptok.my.id/docs",
  }, { status: 410 });
}
