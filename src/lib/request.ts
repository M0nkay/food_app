// Piccoli helper condivisi dalle route API.

// IP del client dietro il proxy di Vercel (best-effort).
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "anon";
}

// Difesa in profondità anti-CSRF per le richieste che cambiano stato.
// SameSite=Lax già blocca i cookie cross-site sui POST; qui rifiutiamo in più
// le richieste il cui header Origin non combacia con l'host servito.
// Un Origin assente (alcuni client legittimi) viene tollerato.
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
