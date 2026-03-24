"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlayCircle, FileText, Zap, Globe, Lock, Key, Copy, Check,
  LogOut, User, ChevronRight, Search, Download, ArrowRight, Loader2,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

const BASE = "https://www.snaptok.my.id";

interface UserData { username: string; email: string; avatar: string; apikey: string; plan: string; requests: number; }

export default function DocsPage() {
  const router            = useRouter();
  const { lang }          = useLang();
  const [user, setUser]   = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((j) => {
      if (j.success) setUser(j.user);
      else router.push("/auth/login?from=/docs");
    }).finally(() => setLoading(false));
  }, [router]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (!user) return null;

  const userKey = user.apikey;

  const sections = [
    { id: "overview",   label: "Overview",        icon: FileText },
    { id: "auth",       label: "Authentication",   icon: Key },
    { id: "download",   label: "Download API",     icon: Download },
    { id: "search",     label: "Search API",       icon: Search },
    { id: "errors",     label: "Error Codes",      icon: Lock },
  ];

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative">
      <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-4 text-sm overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
      <button onClick={() => copy(code, id)}
        className="absolute top-3 right-3 rounded-md bg-zinc-800 hover:bg-zinc-700 p-1.5 transition-colors">
        {copied === id ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <PlayCircle className="h-7 w-7 text-primary" />
            <span>Snap<span className="text-muted-foreground">-Tok</span></span>
            <Badge variant="secondary" className="text-xs ml-1">API Docs</Badge>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/auth/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />{user.username}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-8">

        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Navigation</p>
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left ${
                    activeSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {s.label}
                </button>
              );
            })}

            {/* User API key in sidebar */}
            <div className="mt-6 p-3 rounded-lg bg-muted border border-border">
              <p className="text-xs text-muted-foreground mb-1.5">Your API Key</p>
              <code className="text-xs font-mono text-foreground break-all">{userKey}</code>
              <button onClick={() => copy(userKey, "sidebar-key")}
                className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied === "sidebar-key" ? <><Check className="h-3 w-3 text-green-500" />Copied!</> : <><Copy className="h-3 w-3" />Copy Key</>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-10">

          {/* Overview */}
          {(activeSection === "overview") && (
            <section>
              <h1 className="text-3xl font-bold mb-2">{t(tr.nav.docs, lang)}</h1>
              <p className="text-muted-foreground mb-6">REST API untuk download video TikTok & Douyin dan pencarian video.</p>

              <div className="grid gap-4 sm:grid-cols-3 mb-8">
                {[
                  { icon: Zap,    title: "REST API",     desc: "Simple HTTP GET" },
                  { icon: Globe,  title: "2 Platform",   desc: "TikTok & Douyin" },
                  { icon: Key,    title: "API Key Auth", desc: "snp-xxxxx" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.title} className="border-border">
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-full bg-primary/10 p-2.5"><Icon className="h-4 w-4 text-primary" /></div>
                        <div><p className="font-semibold text-sm">{item.title}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="border-border">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Base URL</h3>
                  <CodeBlock code={BASE} id="base-url" />
                </CardContent>
              </Card>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  { id: "download", label: "Download API →", icon: Download },
                  { id: "search",   label: "Search API →",   icon: Search },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setActiveSection(item.id)}
                      className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors text-left group">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium text-sm">{item.label}</span>
                      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Authentication */}
          {activeSection === "auth" && (
            <section>
              <h2 className="text-2xl font-bold mb-2">Authentication</h2>
              <p className="text-muted-foreground mb-6">Semua endpoint v3 membutuhkan API key. Key kamu ada di bawah ini.</p>

              <Card className="border-border mb-6">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Your API Key</h3>
                    <Badge>{user.plan === "pro" ? "Pro" : "Free"}</Badge>
                  </div>
                  <CodeBlock code={userKey} id="auth-key" />
                  <p className="text-xs text-muted-foreground">
                    Gunakan di query param <code className="bg-muted px-1 rounded text-xs">?apikey=</code> atau header <code className="bg-muted px-1 rounded text-xs">X-API-Key</code>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border mb-4">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Method 1 — Query Parameter</h3>
                  <CodeBlock code={`${BASE}/api/v3/download?platform=tiktok&url=...&apikey=${userKey}`} id="auth-query" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Method 2 — HTTP Header</h3>
                  <CodeBlock code={`fetch("${BASE}/api/v3/download?platform=tiktok&url=...", {\n  headers: {\n    "X-API-Key": "${userKey}"\n  }\n})`} id="auth-header" />
                </CardContent>
              </Card>
            </section>
          )}

          {/* Download API */}
          {activeSection === "download" && (
            <section>
              <h2 className="text-2xl font-bold mb-2">Download API</h2>
              <p className="text-muted-foreground mb-6">Download video TikTok atau Douyin tanpa watermark.</p>

              <Card className="border-border mb-6">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <Badge className="bg-blue-500 text-white">GET</Badge>
                    <code className="text-sm font-mono bg-muted px-3 py-1 rounded">/api/v3/download</code>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Parameter</th>
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Wajib</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">Keterangan</th>
                      </tr></thead>
                      <tbody className="divide-y divide-border">
                        {[
                          { p: "platform", req: true,  d: "tiktok atau douyin" },
                          { p: "url",      req: true,  d: "URL video yang valid" },
                          { p: "apikey",   req: true,  d: "API key kamu" },
                        ].map((row) => (
                          <tr key={row.p}>
                            <td className="py-2.5 pr-4 font-mono text-xs">{row.p}</td>
                            <td className="py-2.5 pr-4"><Badge variant={row.req ? "destructive" : "secondary"} className="text-xs">{row.req ? "Ya" : "Tidak"}</Badge></td>
                            <td className="py-2.5 text-muted-foreground text-xs">{row.d}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* TikTok example */}
              <h3 className="font-semibold mb-3">🎵 Contoh TikTok</h3>
              <Card className="border-border mb-4">
                <CardContent className="p-5">
                  <CodeBlock
                    id="dl-tiktok-url"
                    code={`${BASE}/api/v3/download?platform=tiktok&url=https://vt.tiktok.com/xxx&apikey=${userKey}`}
                  />
                </CardContent>
              </Card>
              <Card className="border-border mb-6">
                <CardContent className="p-5">
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">JavaScript</h4>
                  <CodeBlock id="dl-tiktok-js" code={`const res = await fetch(
  \`${BASE}/api/v3/download?platform=tiktok&url=\${encodeURIComponent(url)}&apikey=${userKey}\`
);
const { data } = await res.json();
console.log(data.download.video_hd);   // URL video HD
console.log(data.download.audio);      // URL audio MP3
console.log(data.download.images);     // Array foto jika slideshow`} />
                </CardContent>
              </Card>

              {/* Douyin example */}
              <h3 className="font-semibold mb-3">🎬 Contoh Douyin</h3>
              <Card className="border-border mb-4">
                <CardContent className="p-5">
                  <CodeBlock
                    id="dl-dy-url"
                    code={`${BASE}/api/v3/download?platform=douyin&url=https://www.douyin.com/video/xxx&apikey=${userKey}`}
                  />
                </CardContent>
              </Card>

              {/* Response */}
              <h3 className="font-semibold mb-3">Response TikTok</h3>
              <Card className="border-border mb-4">
                <CardContent className="p-5">
                  <CodeBlock id="dl-tiktok-res" code={`{
  "success": true,
  "platform": "tiktok",
  "data": {
    "id": "7234567890",
    "title": "Judul video...",
    "cover": "https://...",
    "duration": 30,
    "author": { "nickname": "...", "unique_id": "...", "avatar": "..." },
    "stats": { "play": 120000, "likes": 5000, "comment": 300, "share": 150 },
    "music": { "title": "...", "author": "..." },
    "download": {
      "video_hd": "https://...",
      "video_sd": "https://...",
      "video_watermark": "https://...",
      "audio": "https://...",
      "images": null
    }
  }
}`} />
                </CardContent>
              </Card>

              <h3 className="font-semibold mb-3">Response Douyin</h3>
              <Card className="border-border">
                <CardContent className="p-5">
                  <CodeBlock id="dl-dy-res" code={`{
  "success": true,
  "platform": "douyin",
  "data": {
    "title": "Judul video...",
    "cover": "https://...",
    "download": {
      "video": "https://...",
      "audio": null
    }
  }
}`} />
                </CardContent>
              </Card>
            </section>
          )}

          {/* Search API */}
          {activeSection === "search" && (
            <section>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                Search API <Badge className="bg-green-500 text-white">NEW</Badge>
              </h2>
              <p className="text-muted-foreground mb-6">Cari video TikTok berdasarkan keyword, lengkap dengan link download.</p>

              <Card className="border-border mb-6">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <Badge className="bg-blue-500 text-white">GET</Badge>
                    <code className="text-sm font-mono bg-muted px-3 py-1 rounded">/api/v3/tiktok/search</code>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Parameter</th>
                        <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Default</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">Keterangan</th>
                      </tr></thead>
                      <tbody className="divide-y divide-border">
                        {[
                          { p: "q",      def: "-",  d: "Keyword pencarian (wajib)" },
                          { p: "count",  def: "20", d: "Jumlah video (max 50)" },
                          { p: "cursor", def: "0",  d: "Offset untuk pagination" },
                          { p: "apikey", def: "-",  d: "API key kamu (wajib)" },
                        ].map((row) => (
                          <tr key={row.p}>
                            <td className="py-2.5 pr-4 font-mono text-xs">{row.p}</td>
                            <td className="py-2.5 pr-4 text-xs text-muted-foreground">{row.def}</td>
                            <td className="py-2.5 text-muted-foreground text-xs">{row.d}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border mb-4">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Contoh Request</h3>
                  <CodeBlock id="search-url" code={`${BASE}/api/v3/tiktok/search?q=funny+cats&count=20&apikey=${userKey}`} />
                </CardContent>
              </Card>

              <Card className="border-border mb-4">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">JavaScript + Pagination</h3>
                  <CodeBlock id="search-js" code={`// Search
const res = await fetch(
  \`${BASE}/api/v3/tiktok/search?q=\${encodeURIComponent("funny cats")}&count=20&apikey=${userKey}\`
);
const json = await res.json();

json.videos.forEach(v => {
  console.log(v.title);
  console.log(v.download.video_hd);
  console.log(v.download.audio);
});

// Load more (pagination)
if (json.has_more) {
  const next = await fetch(
    \`${BASE}/api/v3/tiktok/search?q=funny+cats&cursor=\${json.cursor}&apikey=${userKey}\`
  );
}`} />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Response</h3>
                  <CodeBlock id="search-res" code={`{
  "success": true,
  "query": "funny cats",
  "count": 20,
  "cursor": 20,
  "has_more": true,
  "videos": [
    {
      "id": "...",
      "title": "...",
      "cover": "https://...",
      "duration": 15,
      "author": { "nickname": "...", "unique_id": "...", "avatar": "..." },
      "stats": { "play": 50000, "likes": 2000, "comment": 100, "share": 50 },
      "download": {
        "video_hd": "https://...",
        "video_sd": "https://...",
        "video_watermark": "https://...",
        "audio": "https://..."
      }
    }
  ]
}`} />
                </CardContent>
              </Card>
            </section>
          )}

          {/* Error Codes */}
          {activeSection === "errors" && (
            <section>
              <h2 className="text-2xl font-bold mb-2">Error Codes</h2>
              <p className="text-muted-foreground mb-6">Semua error response menggunakan format berikut.</p>

              <Card className="border-border mb-6">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Format Error</h3>
                  <CodeBlock id="err-format" code={`{
  "success": false,
  "error": "Pesan error di sini",
  "docs": "https://www.snaptok.my.id/docs"
}`} />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border">
                        <th className="text-left py-2 pr-6 font-semibold text-muted-foreground">HTTP</th>
                        <th className="text-left py-2 pr-6 font-semibold text-muted-foreground">Penyebab</th>
                      </tr></thead>
                      <tbody className="divide-y divide-border">
                        {[
                          { code: "401", desc: "API key tidak ada, tidak valid, atau tidak dimulai dengan snp-" },
                          { code: "400", desc: "Parameter wajib tidak diisi atau URL tidak valid" },
                          { code: "400", desc: "Video tidak ditemukan / privat / sudah dihapus" },
                          { code: "403", desc: "Domain tidak diizinkan (proxy endpoint)" },
                          { code: "500", desc: "Server error internal, coba lagi beberapa saat" },
                          { code: "502", desc: "Upstream CDN error saat proxy download" },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td className="py-2.5 pr-6 font-mono text-xs font-bold">{row.code}</td>
                            <td className="py-2.5 text-muted-foreground text-xs">{row.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
