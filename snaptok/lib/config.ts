// lib/config.ts
// ── Semua konfigurasi aplikasi ada di sini ──────────────────────────────────
// Ganti nilai di bawah sesuai kebutuhan, tidak perlu .env

export const SMTP = {
  host:   "smtp.gmail.com",
  port:   587,
  secure: false,
  user:   "defandryannn@gmail.com",
  pass:   "jnid cdnj nvmt ahbl", // Gmail: pakai App Password
  from:   "Snaptok <defandryannn@gmail.com>",
};

export const JWT = {
  secret:     "snaptok-jwt-secret-2026-defandryan",
  cookieName: "snaptok_session",
  maxAgeDays: 30,
};
