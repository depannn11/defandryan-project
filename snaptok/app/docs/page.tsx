"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlayCircle, FileText, Zap, Globe, Lock, Key, Copy, Check,
  LogOut, User, ChevronRight, Search, Download, ArrowRight,
  Loader2, Terminal, BookOpen, Code2, Sparkles, Shield,
  ChevronDown, ExternalLink,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
  if (!user) return null;

  const userKey = user.apikey;

  const sections = [
    { id: "overview",   label: "Overview",        icon: BookOpen },
    { id: "auth",       label: "Authentication",   icon: Key },
    { id: "download",   label: "Download API",     icon: Download },
    { id: "search",     label: "Search API",       icon: Search },
    { id: "errors",     label: "Error Codes",      icon: Lock },
  ];

  const CodeBlock = ({ code, id, lang: codeLang }: { code: string; id: string; lang?: string }) => (
    <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
      {codeLang && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
          <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{codeLang}</span>
          <button onClick={() => copy(code, id)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            {copied === id ? <><Check className="h-3 w-3 text-green-400" /><span className="text-green-400">Copied</span></> : <><Copy className="h-3 w-3" />Copy</>}
          </button>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 text-sm overflow-x-auto leading-relaxed text-zinc-300 font-mono">
          <code>{code}</code>
        </pre>
        {!codeLang && (
          <button onClick={() => copy(code, id)}
            className="absolute top-3 right-3 rounded-lg bg-white/10 hover:bg-white/20 p-1.5 opacity-0 group-hover:opacity-100 transition-all">
            {copied === id ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
          </button>
        )}
      </div>
    </div>
  );

  const ParamTable = ({ rows, cols }: { rows: string[][], cols: string[] }) => (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {cols.map((c) => <th key={c} className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`py-3 px-4 ${j === 0 ? "font-mono text-xs text-primary font-medium" : j === 1 ? "" : "text-muted-foreground text-xs"}`}>
                  {j === 1 ? (
                    <Badge variant={cell === "Ya" || cell === "Required" ? "destructive" : "secondary"} className="text-xs">{cell}</Badge>
                  ) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const SectionHeader = ({ title, desc, badge }: { title: string; desc: string; badge?: string }) => (
    <div className="mb-8 pb-6 border-b border-border">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {badge && <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30">{badge}</Badge>}
      </div>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <PlayCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>Snap<span className="text-muted-foreground font-normal">tok</span></span>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-sm">API Docs</span>
              <Badge variant="secondary" className="text-xs ml-1">v3</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <Link href="/auth/profile">
              <Button variant="ghost" size="sm" className="gap-2 h-8 text-xs">
                <div className="h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="hidden sm:inline">{user.username}</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-6 max-w-6xl">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
          <div className="sticky top-[88px] space-y-1">

            {/* API Key card */}
            <div className="mb-4 rounded-xl border border-border bg-muted/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">API Key</span>
                <Badge variant="secondary" className="text-xs capitalize">{user.plan}</Badge>
              </div>
              <code className="block text-xs font-mono text-foreground/80 break-all leading-relaxed">{userKey}</code>
              <button onClick={() => copy(userKey, "sidebar-key")}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs rounded-lg bg-background border border-border py-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                {copied === "sidebar-key"
                  ? <><Check className="h-3 w-3 text-green-500" /><span className="text-green-500">Copied!</span></>
                  : <><Copy className="h-3 w-3" />Copy key</>}
              </button>
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1">Navigation</p>
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all text-left ${
                    activeSection === s.id
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  {s.label}
                </button>
              );
            })}

            <div className="pt-3">
              <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                <ExternalLink className="h-3 w-3" />Back to App
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <div className="rounded-2xl border border-border bg-background/95 backdrop-blur shadow-xl p-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium">
              <span className="flex items-center gap-2">
                {(() => { const s = sections.find(s => s.id === activeSection); const Icon = s?.icon ?? BookOpen; return <Icon className="h-4 w-4" />; })()}
                {sections.find(s => s.id === activeSection)?.label}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
            </button>
            {sidebarOpen && (
              <div className="mt-1 border-t border-border pt-1 flex flex-col gap-0.5">
                {sections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button key={s.id} onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                        activeSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                      }`}>
                      <Icon className="h-3.5 w-3.5" />{s.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-32 lg:pb-8">

          {/* ── Overview ── */}
          {activeSection === "overview" && (
            <section className="space-y-6">
              <SectionHeader title="API Documentation" desc="REST API untuk download video TikTok & Douyin dan pencarian video tanpa watermark." />

              {/* Stats */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Zap,      title: "REST API",     desc: "Simple HTTP GET",     color: "text-amber-500",   bg: "bg-amber-500/10" },
                  { icon: Globe,    title: "2 Platform",   desc: "TikTok & Douyin",     color: "text-blue-500",    bg: "bg-blue-500/10" },
                  { icon: Shield,   title: "API Key Auth", desc: "Format snp-xxxxx",    color: "text-green-500",   bg: "bg-green-500/10" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl border border-border p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                      <div className={`rounded-lg ${item.bg} p-2.5 flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Base URL */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Base URL</span>
                </div>
                <div className="p-4">
                  <CodeBlock code={BASE} id="base-url" />
                </div>
              </div>

              {/* Quick nav */}
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { id: "download", label: "Download API", desc: "TikTok & Douyin video/audio", icon: Download, color: "text-primary" },
                  { id: "search",   label: "Search API",   desc: "Search TikTok by keyword",    icon: Search,   color: "text-primary" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setActiveSection(item.id)}
                      className="group flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-muted/40 hover:border-primary/30 transition-all text-left">
                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Your key callout */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1">API key kamu sudah aktif</p>
                  <code className="text-xs font-mono text-muted-foreground break-all">{userKey}</code>
                </div>
                <button onClick={() => copy(userKey, "overview-key")}
                  className="flex-shrink-0 rounded-lg bg-primary/10 hover:bg-primary/20 p-1.5 transition-colors">
                  {copied === "overview-key" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-primary" />}
                </button>
              </div>
            </section>
          )}

          {/* ── Authentication ── */}
          {activeSection === "auth" && (
            <section className="space-y-5">
              <SectionHeader title="Authentication" desc="Semua endpoint v3 membutuhkan API key. Tambahkan key ke setiap request." />

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your API Key</span>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">{user.plan}</Badge>
                </div>
                <div className="p-4">
                  <CodeBlock code={userKey} id="auth-key" />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method 1 — Query Parameter</p>
                </div>
                <div className="p-4">
                  <CodeBlock code={`${BASE}/api/v3/download?platform=tiktok&url=...&apikey=${userKey}`} id="auth-query" />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method 2 — HTTP Header</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="javascript" id="auth-header" code={`fetch("${BASE}/api/v3/download?platform=tiktok&url=...", {
  headers: {
    "X-API-Key": "${userKey}"
  }
})`} />
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
                <Shield className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-600 dark:text-amber-400 mb-0.5">Jaga kerahasiaan API key kamu</p>
                  <p className="text-muted-foreground text-xs">Jangan expose API key di client-side code yang public. Gunakan environment variables.</p>
                </div>
              </div>
            </section>
          )}

          {/* ── Download API ── */}
          {activeSection === "download" && (
            <section className="space-y-5">
              <SectionHeader title="Download API" desc="Download video TikTok atau Douyin tanpa watermark, termasuk audio dan slideshow foto." />

              {/* Endpoint */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-3">
                  <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">GET</Badge>
                  <code className="text-sm font-mono text-foreground">/api/v3/download</code>
                </div>
                <div className="p-4">
                  <ParamTable
                    cols={["Parameter", "Wajib", "Keterangan"]}
                    rows={[
                      ["platform", "Ya",    "tiktok atau douyin"],
                      ["url",      "Ya",    "URL video yang valid"],
                      ["apikey",   "Ya",    "API key kamu (format snp-xxx)"],
                    ]}
                  />
                </div>
              </div>

              {/* TikTok */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🎵</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TikTok — Request</span>
                </div>
                <div className="p-4 space-y-3">
                  <CodeBlock id="dl-tiktok-url" code={`${BASE}/api/v3/download?platform=tiktok&url=https://vt.tiktok.com/xxx&apikey=${userKey}`} />
                  <CodeBlock lang="javascript" id="dl-tiktok-js" code={`const res = await fetch(
  \`${BASE}/api/v3/download?platform=tiktok&url=\${encodeURIComponent(url)}&apikey=${userKey}\`
);
const { data } = await res.json();
console.log(data.download.video_hd);   // URL video HD (via proxy)
console.log(data.download.audio);      // URL audio MP3
console.log(data.download.images);     // Array foto jika slideshow`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🎵</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TikTok — Response</span>
                </div>
                <div className="p-4">
                  <CodeBlock lang="json" id="dl-tiktok-res" code={`{
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
      "video_hd": "/api/v3/proxy?url=...",
      "video_sd": "/api/v3/proxy?url=...",
      "video_watermark": "/api/v3/proxy?url=...",
      "audio": "/api/v3/proxy?url=...",
      "images": null
    }
  }
}`} />
                </div>
              </div>

              {/* Douyin */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🎬</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Douyin — Request</span>
                </div>
                <div className="p-4">
                  <CodeBlock id="dl-dy-url" code={`${BASE}/api/v3/download?platform=douyin&url=https://www.douyin.com/video/xxx&apikey=${userKey}`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🎬</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Douyin — Response</span>
                </div>
                <div className="p-4">
                  <CodeBlock lang="json" id="dl-dy-res" code={`{
  "success": true,
  "platform": "douyin",
  "data": {
    "id": "...",
    "title": "Judul video...",
    "cover": "https://...",
    "duration": 30,
    "author": { "nickname": "...", "unique_id": "...", "avatar": "..." },
    "stats": { "play": 0, "likes": 0, "comment": 0, "share": 0 },
    "music": { "title": "...", "author": "..." },
    "download": {
      "video": "/api/v3/proxy?url=...",
      "video_hd": "/api/v3/proxy?url=...",
      "audio": "/api/v3/proxy?url=...",
      "images": null
    }
  }
}`} />
                </div>
              </div>
            </section>
          )}

          {/* ── Search API ── */}
          {activeSection === "search" && (
            <section className="space-y-5">
              <SectionHeader title="Search API" desc="Cari video TikTok berdasarkan keyword, lengkap dengan link download." badge="NEW" />

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-3">
                  <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">GET</Badge>
                  <code className="text-sm font-mono text-foreground">/api/v3/tiktok/search</code>
                </div>
                <div className="p-4">
                  <ParamTable
                    cols={["Parameter", "Default", "Keterangan"]}
                    rows={[
                      ["q",      "-",   "Keyword pencarian (wajib)"],
                      ["count",  "20",  "Jumlah video (max 50)"],
                      ["cursor", "0",   "Offset untuk pagination"],
                      ["apikey", "-",   "API key kamu (wajib)"],
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request + Pagination</p>
                </div>
                <div className="p-4 space-y-3">
                  <CodeBlock id="search-url" code={`${BASE}/api/v3/tiktok/search?q=funny+cats&count=20&apikey=${userKey}`} />
                  <CodeBlock lang="javascript" id="search-js" code={`const res = await fetch(
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
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="json" id="search-res" code={`{
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
                </div>
              </div>
            </section>
          )}

          {/* ── Error Codes ── */}
          {activeSection === "errors" && (
            <section className="space-y-5">
              <SectionHeader title="Error Codes" desc="Semua error response menggunakan format JSON standar berikut." />

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Format Error</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="json" id="err-format" code={`{
  "success": false,
  "error": "Pesan error di sini",
  "docs": "https://www.snaptok.my.id/docs"
}`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HTTP Status Codes</span>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { code: "401", color: "bg-red-500/10 text-red-500",    desc: "API key tidak ada, tidak valid, atau tidak dimulai dengan snp-" },
                    { code: "400", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", desc: "Parameter wajib tidak diisi atau URL tidak valid" },
                    { code: "400", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", desc: "Video tidak ditemukan / privat / sudah dihapus" },
                    { code: "403", color: "bg-orange-500/10 text-orange-500", desc: "Domain tidak diizinkan (proxy endpoint)" },
                    { code: "500", color: "bg-red-500/10 text-red-500",    desc: "Server error internal, coba lagi beberapa saat" },
                    { code: "502", color: "bg-red-500/10 text-red-500",    desc: "Upstream CDN error saat proxy download" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${row.color} flex-shrink-0`}>{row.code}</span>
                      <span className="text-sm text-muted-foreground">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
