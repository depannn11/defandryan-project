// lib/otp.ts — OTP stored di Pterodactyl sebagai _otp_{token}.json
// TTL 10 menit, hapus otomatis saat verify
import { readUserFile, writeUserFile, deleteUserFile } from "./pterodactyl";

interface OtpRecord {
  otp:       string;   // 6 digit
  email:     string;
  type:      "register" | "login";
  expiresAt: number;   // unix ms
  // data register disimpan sementara sampai OTP verified
  pending?: {
    username: string;
    passwordHash: string;
    apikey: string;
  };
}

const OTP_TTL_MS = 10 * 60 * 1000; // 10 menit

function generateOtp(): string {
  // 6 digit angka
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpKey(token: string): string {
  return `_otp_${token}.json`;
}

// Buat token acak untuk identify sesi OTP (dikembalikan ke client, disimpan di state)
function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Buat OTP baru, simpan ke Pterodactyl, return { token, otp } ──────────────
export async function createOtp(
  email: string,
  type: "register" | "login",
  pending?: OtpRecord["pending"]
): Promise<{ token: string; otp: string }> {
  const otp   = generateOtp();
  const token = generateToken();

  const record: OtpRecord = {
    otp,
    email,
    type,
    expiresAt: Date.now() + OTP_TTL_MS,
    ...(pending ? { pending } : {}),
  };

  await writeUserFile(otpKey(token), record as unknown as Record<string, unknown>);
  return { token, otp };
}

// ── Verifikasi OTP — return record jika valid, null jika tidak ───────────────
export async function verifyOtp(
  token: string,
  otp: string
): Promise<{ valid: true; record: OtpRecord } | { valid: false; error: string }> {
  const raw = await readUserFile(otpKey(token)) as OtpRecord | null;

  if (!raw)                           return { valid: false, error: "Kode tidak ditemukan atau sudah kedaluwarsa." };
  if (Date.now() > raw.expiresAt)     { await deleteUserFile(otpKey(token)); return { valid: false, error: "Kode sudah kedaluwarsa. Minta ulang." }; }
  if (raw.otp !== otp.trim())         return { valid: false, error: "Kode verifikasi salah." };

  // Hapus OTP setelah berhasil (single-use)
  await deleteUserFile(otpKey(token));
  return { valid: true, record: raw };
}
