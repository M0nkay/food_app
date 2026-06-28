// Autenticazione minimale a password condivisa (strumento di famiglia, non servizio pubblico).
// Il token nel cookie è una derivazione A SENSO UNICO della password (HMAC-SHA256):
// dal cookie NON si può risalire alla password, e solo chi conosce la password
// (passando da /api/auth) può produrre un token valido.
import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE = "cucina_auth";

// Etichetta di dominio: cambiarla invalida tutti i cookie esistenti (rotazione).
const LABEL = "cucina-estate::auth::v2";

export function tokenFor(password: string): string {
  if (!password) return "";
  // HMAC con chiave = password: output deterministico, non invertibile.
  return createHmac("sha256", password).update(LABEL).digest("base64url");
}

export function expectedToken(): string {
  return tokenFor(process.env.APP_PASSWORD || "");
}

// Confronto a tempo costante. Ritorna false se uno dei due è vuoto o di lunghezza
// diversa (evita di rivelare informazioni e di far lanciare timingSafeEqual).
export function safeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

// True se il token del cookie corrisponde a quello atteso dal server.
export function isValidToken(token: string | undefined | null): boolean {
  const expected = expectedToken();
  if (!expected || !token) return false;
  return safeEqual(token, expected);
}
