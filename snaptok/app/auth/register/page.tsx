"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayCircle, Loader2, Eye, EyeOff, Check, Mail, ArrowLeft } from "lucide-react";
import { OTPInput, SlotProps } from "input-otp";

function Slot(props: SlotProps) {
  return (
    <div
      className={[
        "relative w-11 h-14 text-[22px] font-bold",
        "flex items-center justify-center",
        "border-2 rounded-lg transition-all duration-200",
        "select-none",
        props.isActive
          ? "border-primary ring-2 ring-primary/20 bg-background"
          : "border-border bg-muted/30",
      ].join(" ")}
    >
      {props.char !== null ? (
        <div>{props.char}</div>
      ) : (
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
      )}
      {props.hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-6 bg-primary animate-caret-blink" />
        </div>
      )}
    </div>
  );
}

type Step = "form" | "otp";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm]         = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const [step, setStep]           = useState<Step>("form");
  const [otpToken, setOtpToken]   = useState("");
  const [maskedEmail, setMasked]  = useState("");
  const [otp, setOtp]             = useState("");
  const [otpLoading, setOtpLoad]  = useState(false);
  const [otpError, setOtpError]   = useState("");
  const [resendCd, setResendCd]   = useState(0);
  const [success, setSuccess]     = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Password tidak cocok."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "register", username: form.username, email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }
      setOtpToken(json.token);
      setMasked(form.email);
      setStep("otp");
      startResendCountdown();
    } catch { setError("Terjadi kesalahan. Coba lagi."); }
    finally   { setLoading(false); }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) { setOtpError("Masukkan 6 digit kode."); return; }
    setOtpLoad(true); setOtpError("");
    try {
      const res  = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otpToken, otp }),
      });
      const json = await res.json();
      if (!json.success) { setOtpError(json.error); return; }
      setSuccess(true);
      setTimeout(() => router.push("/docs"), 1800);
    } catch { setOtpError("Terjadi kesalahan. Coba lagi."); }
    finally   { setOtpLoad(false); }
  };

  const handleResend = async () => {
    if (resendCd > 0) return;
    setOtpError(""); setOtp("");
    try {
      const res  = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "register", username: form.username, email: form.email, password: form.password }),
      });
      const json = await res.json();
      if (!json.success) { setOtpError(json.error); return; }
      setOtpToken(json.token);
      startResendCountdown();
    } catch { setOtpError("Gagal mengirim ulang. Coba lagi."); }
  };

  const startResendCountdown = () => {
    setResendCd(60);
    const iv = setInterval(() => {
      setResendCd((c) => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; });
    }, 1000);
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">Akun berhasil dibuat!</h2>
        <p className="text-muted-foreground text-sm">Mengarahkan ke Docs…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <PlayCircle className="h-8 w-8 text-primary" />
            <span>Snap<span className="text-muted-foreground">-Tok</span></span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Buat akun untuk akses API</p>
        </div>

        {step === "form" && (
          <Card className="border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Daftar</CardTitle>
              <CardDescription>Buat akun Snaptok API gratis</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Username</label>
                  <Input value={form.username} onChange={set("username")}
                    placeholder="min 3 karakter, hanya huruf/angka/_"
                    autoComplete="username" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" value={form.email} onChange={set("email")}
                    placeholder="email@example.com" autoComplete="email" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                      placeholder="min 6 karakter" autoComplete="new-password" required className="pr-10" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Konfirmasi Password</label>
                  <Input type="password" value={form.confirm} onChange={set("confirm")}
                    placeholder="ulangi password" autoComplete="new-password" required />
                </div>
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mengirim kode…</>
                    : "Daftar & Verifikasi Email"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="font-medium text-primary hover:underline">Login</Link>
              </p>
            </CardContent>
          </Card>
        )}

        {step === "otp" && (
          <Card className="border-border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Verifikasi Email</CardTitle>
                  <CardDescription>
                    Kode dikirim ke <span className="font-medium text-foreground">{maskedEmail}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Masukkan 6 digit kode verifikasi. Kode berlaku <strong>10 menit</strong>.
              </p>
              <div className="flex justify-center">
                <OTPInput
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerify}
                  containerClassName="flex gap-2"
                  render={({ slots }) => (
                    <>
                      {slots.slice(0, 3).map((slot, i) => <Slot key={i} {...slot} />)}
                      <div className="flex items-center text-muted-foreground font-bold text-xl px-1">—</div>
                      {slots.slice(3).map((slot, i) => <Slot key={i + 3} {...slot} />)}
                    </>
                  )}
                />
              </div>
              {otpError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive text-center">{otpError}</p>
                </div>
              )}
              <Button className="w-full" onClick={handleVerify} disabled={otp.length !== 6 || otpLoading}>
                {otpLoading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memverifikasi…</>
                  : <><Check className="mr-2 h-4 w-4" />Verifikasi & Buat Akun</>}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => { setStep("form"); setOtp(""); setOtpError(""); }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Kembali
                </button>
                <button type="button" onClick={handleResend} disabled={resendCd > 0}
                  className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
                  {resendCd > 0 ? `Kirim ulang (${resendCd}s)` : "Kirim ulang kode"}
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">← Kembali ke Snaptok</Link>
        </p>
      </div>
    </div>
  );
}
