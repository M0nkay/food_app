import { NextResponse } from "next/server";
import { AUTH_COOKIE, tokenFor, expectedToken, safeEqual } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { clientIp, sameOrigin } from "@/lib/request";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Difesa in profondità anti-CSRF.
  if (!sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Origine non valida." }, { status: 403 });
  }

  // Anti-brute-force: poche prove per IP (il gate è una sola password condivisa).
  // Nota: in-memory per-istanza su serverless (vedi rateLimit.ts) — alza comunque l'asticella.
  const rl = rateLimit(`auth:${clientIp(req)}`, 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Troppi tentativi, riprova tra poco." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } }
    );
  }

  const expected = process.env.APP_PASSWORD || "";
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "APP_PASSWORD non configurata sul server." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}) as { password?: string });
  const password = typeof (body as { password?: unknown }).password === "string"
    ? ((body as { password?: string }).password as string)
    : "";

  // Confronto a tempo costante sui token derivati (mai sulla password in chiaro).
  if (!safeEqual(tokenFor(password), expectedToken())) {
    return NextResponse.json({ ok: false, error: "Password errata." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, tokenFor(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 60 // 60 giorni
  });
  return res;
}
