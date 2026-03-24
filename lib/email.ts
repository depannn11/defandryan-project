// lib/email.ts — kirim email via Nodemailer SMTP
// Konfigurasi SMTP ada di lib/config.ts
import nodemailer from "nodemailer";
import { SMTP } from "./config";

const transporter = nodemailer.createTransport({
  host:   SMTP.host,
  port:   SMTP.port,
  secure: SMTP.secure,
  auth: {
    user: SMTP.user,
    pass: SMTP.pass,
  },
});

export async function sendOtpEmail(
  to: string,
  otp: string,
  type: "register" | "login"
): Promise<{ success: boolean; error?: string }> {
  const isRegister = type === "register";
  const subject    = isRegister
    ? "Kode Verifikasi Registrasi Snaptok"
    : "Kode Verifikasi Login Snaptok";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:28px 32px;text-align:center;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
                ▶ Snap<span style="color:#aaaaaa;">-Tok</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#111;">
                ${isRegister ? "Verifikasi Akun Baru" : "Verifikasi Login"}
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#555;line-height:1.6;">
                ${isRegister
                  ? "Gunakan kode di bawah untuk menyelesaikan pendaftaran akunmu."
                  : "Gunakan kode di bawah untuk masuk ke akunmu."}
                Kode ini berlaku selama <strong>10 menit</strong> dan hanya bisa digunakan sekali.
              </p>
              <!-- OTP Box -->
              <div style="background:#f4f4f5;border-radius:8px;padding:20px;text-align:center;margin-bottom:28px;">
                <span style="font-size:38px;font-weight:700;letter-spacing:12px;color:#111;font-family:monospace;">
                  ${otp}
                </span>
              </div>
              <p style="margin:0;font-size:13px;color:#888;line-height:1.5;">
                Kalau kamu tidak meminta kode ini, abaikan email ini. Jangan bagikan kode ini ke siapapun.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaa;">
                © ${new Date().getFullYear()} Snaptok · snaptok.my.id
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: SMTP.from,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("[email] sendMail error:", err);
    return { success: false, error: String(err) };
  }
}
