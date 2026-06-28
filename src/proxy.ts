import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, isValidToken } from "@/lib/auth";

// Protegge tutta l'app dietro la password condivisa.
// In Next 16 questa è la convenzione `proxy` (ex `middleware`): gira sul runtime Node.js.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Percorsi sempre liberi: login, API di auth, asset statici, PWA.
  const open =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico";

  if (open) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE)?.value;

  if (!isValidToken(token)) {
    if (pathname.startsWith("/api/")) {
      return new NextResponse("Non autorizzato", { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
