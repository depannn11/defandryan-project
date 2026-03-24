"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayCircle, Loader2, Eye, EyeOff, Mail, ArrowLeft, Check, KeyRound, ShieldCheck, RefreshCw } from "lucide-react";
import { OTPInput, SlotProps } from "input-otp";

function Slot(props: SlotProps) {
  return (
    <div
      className={[
        "relative w-12 h-14 text-[22px] font-bold",
        "flex items-center justify-center",
        "border-2 rounded-xl transition-all duration-200",
        "select-none",
        props.isActive
          ? "border-primary ring-2 ring-primary/20 bg-background shadow-sm scale-105"
          : "border-border bg-muted/40",
      ].join(" ")}
    >
      {props.char !== null ? (
        <div className="animate-in zoom-in-50 duration-100">{props.char}</div>
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
      )}
      {props.hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-6 bg-primary animate-caret-blink" />
        </div>
      )}
    </div>
  );
}

type Step = "form" | "otp" | "reset_request" | "reset_otp" | "reset_newpass";

function LoginForm() {
  const router  = useRouter();
  const params  = useSearchParams();
  const from    = params.get("from") ?? "/docs";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const [resetUsername, setResetUsername] = useState("");
  const [resetLoading, setResetLoading]   = useState(false);
  const [resetError, setResetError]       = useState("");
  const [resetOtp, setResetOtp]           = useState("");
  const [resetToken, setResetToken]       = useState("");
  const [resetMasked, setResetMasked]     = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [showNewPass, setShowNewPass]     = useState(false);
  const [resetSuccess, setResetSuccess]   = useState(false);

  const startCountdown = (setter: (v: number) => void) => {
    setter(60);
    const iv = setInterval(() => {
      setter((c) => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; });
    }, 1000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "login", username, password }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }
      setOtpToken(json.token);
      setMasked(json.maskedEmail);
      setStep("otp");
      startCountdown(setResendCd);
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
      router.push(from);
      router.refresh();
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
        body: JSON.stringify({ type: "login", username, password }),
      });
      const json = await res.json();
      if (!json.success) { setOtpError(json.error); return; }
      setOtpToken(json.token);
      startCountdown(setResendCd);
    } catch { setOtpError("Gagal mengirim ulang. Coba lagi."); }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true); setResetError("");
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "request", username: resetUsername }),
      });
      const json = await res.json();
      if (!json.success) { setResetError(json.error); return; }
      setResetToken(json.token);
      setResetMasked(json.maskedEmail);
      setStep("reset_otp");
      startCountdown(setResendCd);
    } catch { setResetError("Terjadi kesalahan. Coba lagi."); }
    finally   { setResetLoading(false); }
  };

  const handleResetOtp = async () => {
    if (resetOtp.length !== 6) { setResetError("Masukkan 6 digit kode."); return; }
    setResetLoading(true); setResetError("");
    try {
      const res  = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, otp: resetOtp }),
      });
      const json = await res.json();
      if (!json.success) { setResetError(json.error); return; }
      setStep("reset_newpass");
    } catch { setResetError("Terjadi kesalahan. Coba lagi."); }
    finally   { setResetLoading(false); }
  };

  const handleResetNewPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { setResetError("Password minimal 6 karakter."); return; }
    setResetLoading(true); setResetError("");
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "verify", token: resetToken, otp: resetOtp, username: resetUsername, newPassword }),
      });
      const json = await res.json();
      if (!json.success) { setResetError(json.error); return; }
      setResetSuccess(true);
      setTimeout(() => {
        setStep("form");
        setResetSuccess(false);
        setResetUsername(""); setResetOtp(""); setResetToken(""); setNewPassword("");
      }, 2500);
    } catch { setResetError("Terjadi kesalahan. Coba lagi."); }
    finally   { setResetLoading(false); }
  };

  const handleResetResend = async () => {
    if (resendCd > 0) return;
    setResetError(""); setResetOtp("");
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "request", username: resetUsername }),
      });
      const json = await res.json();
      if (!json.success) { setResetError(json.error); return; }
      setResetToken(json.token);
      startCountdown(setResendCd);
    } catch { setResetError("Gagal mengirim ulang. Coba lagi."); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <PlayCircle className="h-8 w-8 text-primary" />
            <span>Snap<span className="text-muted-foreground">-Tok</span></span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Login untuk akses API Docs</p>
        </div>

        {/* STEP 1: Form Login */}
        {step === "form" && (
          <Card className="border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>Masukkan username dan password kamu</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Username</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder="username" autoComplete="username" required />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Password</label>
                    <button type="button"
                      onClick={() => { setStep("reset_request"); setResetError(""); setResetUsername(username); }}
                      className="text-xs text-primary hover:underline">
                      Lupa password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input type={showPass ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" autoComplete="current-password" required className="pr-10" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memverifikasi…</>
                    : "Login"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/auth/register" className="font-medium text-primary hover:underline">Daftar sekarang</Link>
              </p>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: OTP Login */}
        {step === "otp" && (
          <Card className="border-border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Verifikasi Email</CardTitle>
                  <CardDescription>
                    Kode dikirim ke <span className="font-semibold text-foreground">{maskedEmail}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl bg-muted/50 border border-border p-3 text-sm text-muted-foreground">
                Masukkan 6 digit kode verifikasi dari email kamu. Kode berlaku <strong className="text-foreground">10 menit</strong>.
              </div>
              <div className="flex flex-col items-center gap-2">
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
                <p className="text-xs text-muted-foreground">Ketik kode di atas</p>
              </div>
              {otpError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive text-center">{otpError}</p>
                </div>
              )}
              <Button className="w-full h-11" onClick={handleVerify} disabled={otp.length !== 6 || otpLoading}>
                {otpLoading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memverifikasi…</>
                  : <><ShieldCheck className="mr-2 h-4 w-4" />Konfirmasi Login</>}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => { setStep("form"); setOtp(""); setOtpError(""); }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Kembali
                </button>
                <button type="button" onClick={handleResend} disabled={resendCd > 0}
                  className="flex items-center gap-1 text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
                  <RefreshCw className="h-3 w-3" />
                  {resendCd > 0 ? `Kirim ulang (${resendCd}s)` : "Kirim ulang kode"}
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Reset - masukkan username */}
        {step === "reset_request" && (
          <Card className="border-border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <KeyRound className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Reset Password</CardTitle>
                  <CardDescription>Masukkan username akunmu</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetRequest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Username</label>
                  <Input value={resetUsername} onChange={(e) => setResetUsername(e.target.value)}
                    placeholder="username" autoComplete="username" required />
                </div>
                <p className="text-xs text-muted-foreground">
                  Kode verifikasi akan dikirim ke email yang terdaftar pada akun tersebut.
                </p>
                {resetError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                    <p className="text-sm text-destructive">{resetError}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={resetLoading}>
                  {resetLoading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mengirim kode…</>
                    : <><Mail className="mr-2 h-4 w-4" />Kirim Kode Verifikasi</>}
                </Button>
              </form>
              <button type="button" onClick={() => { setStep("form"); setResetError(""); }}
                className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Login
              </button>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Reset - verifikasi OTP */}
        {step === "reset_otp" && (
          <Card className="border-border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Verifikasi Email</CardTitle>
                  <CardDescription>
                    Kode dikirim ke <span className="font-semibold text-foreground">{resetMasked}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl bg-muted/50 border border-border p-3 text-sm text-muted-foreground">
                Masukkan kode verifikasi untuk melanjutkan reset password. Berlaku <strong className="text-foreground">10 menit</strong>.
              </div>
              <div className="flex flex-col items-center gap-2">
                <OTPInput
                  maxLength={6}
                  value={resetOtp}
                  onChange={setResetOtp}
                  onComplete={handleResetOtp}
                  containerClassName="flex gap-2"
                  render={({ slots }) => (
                    <>
                      {slots.slice(0, 3).map((slot, i) => <Slot key={i} {...slot} />)}
                      <div className="flex items-center text-muted-foreground font-bold text-xl px-1">—</div>
                      {slots.slice(3).map((slot, i) => <Slot key={i + 3} {...slot} />)}
                    </>
                  )}
                />
                <p className="text-xs text-muted-foreground">Ketik kode di atas</p>
              </div>
              {resetError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive text-center">{resetError}</p>
                </div>
              )}
              <Button className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleResetOtp} disabled={resetOtp.length !== 6 || resetLoading}>
                {resetLoading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memverifikasi…</>
                  : <><ShieldCheck className="mr-2 h-4 w-4" />Verifikasi Kode</>}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => { setStep("reset_request"); setResetOtp(""); setResetError(""); }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Kembali
                </button>
                <button type="button" onClick={handleResetResend} disabled={resendCd > 0}
                  className="flex items-center gap-1 text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
                  <RefreshCw className="h-3 w-3" />
                  {resendCd > 0 ? `Kirim ulang (${resendCd}s)` : "Kirim ulang kode"}
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 5: Reset - input password baru */}
        {step === "reset_newpass" && (
          <Card className="border-border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${resetSuccess ? "bg-green-500/10" : "bg-green-500/10"}`}>
                  {resetSuccess
                    ? <Check className="h-5 w-5 text-green-500" />
                    : <KeyRound className="h-5 w-5 text-green-600" />}
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {resetSuccess ? "Password Berhasil Direset!" : "Password Baru"}
                  </CardTitle>
                  <CardDescription>
                    {resetSuccess ? "Mengalihkan ke halaman login…" : `Buat password baru untuk @${resetUsername}`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {!resetSuccess && (
              <CardContent>
                <form onSubmit={handleResetNewPass} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Password Baru</label>
                    <div className="relative">
                      <Input type={showNewPass ? "text" : "password"} value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 karakter" required className="pr-10" />
                      <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {resetError && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                      <p className="text-sm text-destructive">{resetError}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={resetLoading}>
                    {resetLoading
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan…</>
                      : <><Check className="mr-2 h-4 w-4" />Simpan Password Baru</>}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">← Kembali ke Snaptok</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
