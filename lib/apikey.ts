// lib/apikey.ts — validate API key dari request, increment request count
import { readUserFile, writeUserFile } from "./pterodactyl";

export async function validateApiKey(
  apikey: string
): Promise<{ valid: boolean; username?: string; error?: string }> {
  if (!apikey || !apikey.startsWith("snp-")) {
    return { valid: false, error: "Format API key tidak valid." };
  }

  const index = (await readUserFile("_index.json")) as Record<string, string> | null;
  if (!index) return { valid: false, error: "Index tidak ditemukan." };

  const username = index[apikey];
  if (!username) return { valid: false, error: "API key tidak valid." };

  return { valid: true, username };
}

export async function incrementRequests(username: string): Promise<void> {
  try {
    const data = (await readUserFile(`${username}.json`)) as Record<string, unknown> | null;
    if (!data) return;
    data.requests = ((data.requests as number) ?? 0) + 1;
    await writeUserFile(`${username}.json`, data);
  } catch { /* silent */ }
}

// Helper — baca apikey dari request (query param atau header)
export function extractApiKey(req: Request): string {
  const url    = new URL(req.url);
  return url.searchParams.get("apikey") ?? req.headers.get("x-api-key") ?? "";
}
