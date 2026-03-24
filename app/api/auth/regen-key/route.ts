// app/api/auth/regen-key/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser, generateApiKey, updateUser, addToApiKeyIndex } from "@/lib/auth";
import { readUserFile, writeUserFile } from "@/lib/pterodactyl";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const newKey = generateApiKey();

    // Remove old key from index
    const index = (await readUserFile("_index.json") as Record<string, string> | null) ?? {};
    // Find and remove old key
    for (const [k, v] of Object.entries(index)) {
      if (v === user.username) { delete index[k]; break; }
    }
    index[newKey] = user.username;
    await writeUserFile("_index.json", index);

    // Update user file
    await updateUser(user.username, { apikey: newKey });

    return NextResponse.json({ success: true, apikey: newKey });
  } catch {
    return NextResponse.json({ error: "Gagal generate key baru." }, { status: 500 });
  }
}
