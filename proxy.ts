import { NextRequest, NextResponse } from "next/server";

const PROTECTED_COOKIE = "prototype_auth";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login oldal és API route szabadon elérhető
  if (pathname === "/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Static fájlok szabadon elérhetők (/public mappa)
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Cookie ellenőrzés
  const auth = req.cookies.get(PROTECTED_COOKIE);
  if (auth?.value === "1") {
    return NextResponse.next();
  }

  // Nincs érvényes cookie → login oldalra
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};