// Rate limit in-memory, PER-ISTANZA. Evita raffiche accidentali/costose, ma su
// serverless (Vercel) i contatori NON sono condivisi tra le lambda né persistono
// tra i cold start: il limite effettivo può quindi essere più alto del nominale.
// Per questo il controllo di costo durevole NON è qui ma nei bound sul body della
// chat (MAX_MESSAGES / MAX_*_CHARS / MAX_BODY_BYTES) + MAX_TOKENS e nel gate auth.
// Se in futuro servisse un limite robusto, sostituire questo store con Vercel KV /
// Upstash Redis (atomic INCR + EXPIRE) mantenendo la stessa firma `rateLimit()`.
type Bucket = { count: number; reset: number };

const store = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): { ok: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const b = store.get(key);
  if (!b || now > b.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (b.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((b.reset - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count };
}
