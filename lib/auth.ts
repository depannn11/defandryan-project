// lib/auth.ts
// JWT session management + user helpers

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { readUserFile, writeUserFile } from "./pterodactyl";

const JWT_SECRET = new TextEncoder().encode("snaptok-jwt-secret-2026-defandryan");
const COOKIE_NAME = "snaptok_session";

export interface User {
  username: string;
  email:    string;
  password: string; // bcrypt hash — tapi kita simple SHA256
  avatar:   string; // URL or base64
  apikey:   string; // snp-xxxxxxxx
  created:  string;
  plan:      "free" | "pro";
  requests:  number; // total API requests used
}

export interface SessionUser {
  username: string;
  email:    string;
  avatar:   string;
  apikey:   string;
  plan:     "free" | "pro";
}

// ── Simple hash (no bcrypt to avoid native deps) ──────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password + "snaptok_salt_2026"));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash;
}

// ── API key generator ─────────────────────────────────────────────────────────
export function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const rand  = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => chars[b % chars.length])
    .join("");
  return `snp-${rand}`;
}

// ── JWT ───────────────────────────────────────────────────────────────────────
export async function createSession(user: SessionUser): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

// ── Get current user from cookie ──────────────────────────────────────────────
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySession(token);
  } catch {
    return null;
  }
}

// ── Register ──────────────────────────────────────────────────────────────────
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  // Check username taken
  const existing = await readUserFile(`${username.toLowerCase()}.json`);
  if (existing) return { success: false, error: "Username sudah dipakai." };

  // Check email taken (scan all — simple approach)
  // For now skip email uniqueness check to avoid scanning all files

  const user: User = {
    username: username.toLowerCase(),
    email,
    password: await hashPassword(password),
    avatar:   "",
    apikey:   generateApiKey(),
    created:  new Date().toISOString(),
    plan:     "free",
    requests: 0,
  };

  const ok = await writeUserFile(`${username.toLowerCase()}.json`, user as unknown as Record<string, unknown>);
  if (!ok) return { success: false, error: "Gagal menyimpan user. Coba lagi." };

  const sessionUser: SessionUser = {
    username: user.username,
    email:    user.email,
    avatar:   user.avatar,
    apikey:   user.apikey,
    plan:     user.plan,
  };
  return { success: true, user: sessionUser };
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  const data = await readUserFile(`${username.toLowerCase()}.json`) as User | null;
  if (!data) return { success: false, error: "Username atau password salah." };

  const ok = await verifyPassword(password, data.password);
  if (!ok) return { success: false, error: "Username atau password salah." };

  const sessionUser: SessionUser = {
    username: data.username,
    email:    data.email,
    avatar:   data.avatar,
    apikey:   data.apikey,
    plan:     data.plan,
  };
  return { success: true, user: sessionUser };
}

// ── Validate API key ──────────────────────────────────────────────────────────
export async function validateApiKey(apikey: string): Promise<{ valid: boolean; username?: string }> {
  if (!apikey || !apikey.startsWith("snp-")) return { valid: false };
  // API key format: snp-{username}-{random} — but we use scan approach
  // Actually we store by username.json, so we need an index
  // Simple: parse username from key is not possible, so we check index file
  const index = await readUserFile("_index.json") as Record<string, string> | null;
  if (!index) return { valid: false };
  const username = index[apikey];
  if (!username) return { valid: false };
  return { valid: true, username };
}

// ── Update user file ──────────────────────────────────────────────────────────
export async function updateUser(username: string, updates: Partial<User>): Promise<boolean> {
  const data = await readUserFile(`${username.toLowerCase()}.json`) as User | null;
  if (!data) return false;
  const updated = { ...data, ...updates };
  return await writeUserFile(`${username.toLowerCase()}.json`, updated as unknown as Record<string, unknown>);
}

// ── Add to API key index ──────────────────────────────────────────────────────
export async function addToApiKeyIndex(apikey: string, username: string): Promise<void> {
  const index = (await readUserFile("_index.json") as Record<string, string> | null) ?? {};
  index[apikey] = username;
  await writeUserFile("_index.json", index);
}

export { COOKIE_NAME };
