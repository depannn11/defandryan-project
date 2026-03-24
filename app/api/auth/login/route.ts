// app/api/auth/login/route.ts
// DEPRECATED: Login sekarang menggunakan 2-step OTP flow:
//   1. POST /api/auth/send-otp  { type: "login", username, password }
//   2. POST /api/auth/verify-otp { token, otp }
// Route ini dijaga agar tidak break jika ada yang masih hit endpoint lama.
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({
    error: "Endpoint ini sudah tidak digunakan. Gunakan /api/auth/send-otp untuk login.",
    docs: "https://www.snaptok.my.id/docs",
  }, { status: 410 });
}
