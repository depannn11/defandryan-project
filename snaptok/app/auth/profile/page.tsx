"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlayCircle, Copy, Check, RefreshCw, LogOut, Loader2,
  Key, User, Mail, Activity, Shield, Camera,
} from "lucide-react";
import Image from "next/image";

interface UserData {
  username: string;
  email:    string;
  avatar:   string;
  apikey:   string;
  plan:     string;
  requests: number;
  created:  string;
}

export default function ProfilePage() {
  const router           = useRouter();
  const fileRef          = useRef<HTMLInputElement>(null);
  const [user, setUser]  = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [regen,   setRegen]   = useState(false);
  const [msg,     setMsg]     = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPass,  setEditPass]  = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => { if (j.success) { setUser(j.user); setEditEmail(j.user.email); } else router.push("/auth/login"); })
      .finally(() => setLoading(false));
  }, [router]);

  const copyKey = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.apikey);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMsg("Ukuran foto maksimal 2MB."); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSaving(true);
      const res  = await fetch("/api/auth/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar: base64 }) });
      const json = await res.json();
      if (json.success) { setUser((u) => u ? { ...u, avatar: base64 } : u); setMsg("Foto diperbarui!"); }
      else setMsg(json.error ?? "Gagal update foto.");
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true); setMsg("");
    const body: Record<string, string> = {};
    if (editEmail !== user?.email) body.email = editEmail;
    if (editPass) body.password = editPass;
    if (Object.keys(body).length === 0) { setSaving(false); setMsg("Tidak ada perubahan."); return; }
    const res  = await fetch("/api/auth/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    if (json.success) { setUser((u) => u ? { ...u, ...body } : u); setMsg("Profil diperbarui!"); setEditPass(""); }
    else setMsg(json.error ?? "Gagal update profil.");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleRegenKey = async () => {
    if (!confirm("Yakin mau generate ulang API key? Key lama akan tidak aktif.")) return;
    setRegen(true);
    const res  = await fetch("/api/auth/regen-key", { method: "POST" });
    const json = await res.json();
    if (json.success) { setUser((u) => u ? { ...u, apikey: json.apikey } : u); setMsg("API key baru dibuat!"); }
    else setMsg(json.error ?? "Gagal generate key.");
    setRegen(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <PlayCircle className="h-7 w-7 text-primary" />
            <span>Snap<span className="text-muted-foreground">-Tok</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/docs">
              <Button variant="outline" size="sm">API Docs</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Profil Saya</h1>

        {msg && (
          <div className={`rounded-lg p-3 text-sm font-medium border ${msg.includes("!") ? "bg-green-50 border-green-200 text-green-700" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
            {msg}
          </div>
        )}

        {/* Avatar + Info */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-muted overflow-hidden ring-2 ring-border">
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.username} width={96} height={96} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              {/* Basic info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium bg-primary/5">
                  <Shield className="h-3 w-3 text-primary" />
                  {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </div>
              </div>

              {/* Stats */}
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-1">
                  <Activity className="h-4 w-4" />
                  <span>Total Requests</span>
                </div>
                <p className="text-3xl font-bold text-primary">{user.requests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-muted px-4 py-3 text-sm font-mono text-foreground truncate border border-border">
                {user.apikey}
              </code>
              <Button variant="outline" size="icon" onClick={copyKey} className="flex-shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Tambahkan <code className="bg-muted px-1 rounded">?apikey={user.apikey}</code> ke setiap request API.
              </p>
              <Button variant="ghost" size="sm" onClick={handleRegenKey} disabled={regen} className="text-destructive hover:text-destructive flex-shrink-0">
                {regen ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Edit Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
              </label>
              <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} type="email" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password Baru (kosongkan jika tidak diganti)</label>
              <Input value={editPass} onChange={(e) => setEditPass(e.target.value)} type="password" placeholder="••••••••" />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : "Simpan Perubahan"}
            </Button>
          </CardContent>
        </Card>

        {/* Account info */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              Akun dibuat: <span className="font-medium text-foreground">{new Date(user.created).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
