import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, updateUser, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const allowed: Record<string, unknown> = {};

    if (body.email)    allowed.email  = body.email;
    if (body.avatar)   allowed.avatar = body.avatar;
    if (body.password) allowed.password = await hashPassword(body.password);

    if (Object.keys(allowed).length === 0)
      return NextResponse.json({ error: "Tidak ada yang diperbarui." }, { status: 400 });

    const ok = await updateUser(user.username, allowed as Parameters<typeof updateUser>[1]);
    if (!ok) return NextResponse.json({ error: "Gagal menyimpan perubahan." }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
