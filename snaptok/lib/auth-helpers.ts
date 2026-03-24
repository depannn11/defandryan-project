// lib/auth-helpers.ts — exported hash helper (untuk avoid circular import)
export async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password + "snaptok_salt_2026"));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
