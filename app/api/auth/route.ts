import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const expected = process.env.PROTOTYPE_PASSWORD;

  // Fail-closed: ha nincs beállítva jelszó, senki sem léphet be.
  if (!expected || password !== expected) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("prototype_auth", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 nap
    path: "/",
  });

  return response;
}