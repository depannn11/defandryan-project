import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readUserFile } from "@/lib/pterodactyl";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get fresh data from Pterodactyl
  const data = await readUserFile(`${user.username}.json`);
  if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { password: _, ...safe } = data as Record<string, unknown> & { password: string };
  return NextResponse.json({ success: true, user: safe });
}
