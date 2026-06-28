# SECURITY.md — Cucina Estate

Audit di sicurezza e remediation. App PWA familiare (Next.js App Router) su Vercel.
Data: 2026-06-28. Esito sintetico:

- ✅ `npm audit`: **0 vulnerabilità** (erano 2 *moderate*).
- ✅ Build di produzione e dev server: **funzionanti**, nessuna regressione.
- ✅ Bundle client: **nessun segreto** (`ANTHROPIC_API_KEY` presente solo nei chunk server).
- ✅ Gate di autenticazione: copre la route della chat e **resiste alla chiamata diretta**.

---

## 1. Modello di minaccia

Strumento di famiglia, non servizio pubblico. Asset di valore, in ordine:

1. `ANTHROPIC_API_KEY` (la paga il proprietario) — non deve mai raggiungere client o log.
2. Credito API — chiunque abusi della chat brucia soldi del proprietario (costo/DoS).
3. Gate a password condivisa — non deve essere aggirabile o forzabile.
4. Dipendenze vulnerabili.

Non sono trattati dati personali sensibili; i contenuti (piano pasti) non sono segreti.

---

## 2. Findings e fix (per severità)

Severità: 🔴 High · 🟠 Medium · 🟡 Low. Tutti i finding High/Medium sono stati risolti e verificati.

| # | Sev | Finding | File | Fix |
|---|---|---|---|---|
| H1 | 🔴 | **Nessun anti-brute-force** sul login: una sola password condivisa con tentativi illimitati. | `api/auth/route.ts` | Rate-limit per IP (10/min) prima del confronto password. |
| H2 | 🔴 | **Body della chat non limitato** (numero messaggi, lunghezza, payload): costo token per richiesta illimitato. | `api/chat/route.ts`, `lib/constants.ts` | Validazione + clamp: `MAX_MESSAGES`, `MAX_MESSAGE_CHARS`, `MAX_TOTAL_CHARS`, `MAX_FILTERS`, `MAX_BODY_BYTES`; sanitizzazione ruoli/contenuti. |
| H3 | 🔴 | **Rate-limiter in-memory inefficace su serverless** (contatori non condivisi tra lambda). | `lib/rateLimit.ts` | Documentato il limite; il controllo di costo durevole è ora dato dai bound per-richiesta (H2) + `MAX_TOKENS` + gate auth. Vedi rischio residuo R1. |
| M1 | 🟠 | **Token cookie reversibile**: `base64("cucina-estate::"+password)` conteneva la password. | `lib/auth.ts` | HMAC-SHA256 a senso unico (chiave = `APP_PASSWORD`). Il cookie non rivela più la password. |
| M2 | 🟠 | **Stream Anthropic non abortito** alla disconnessione del client: spreco di token. | `api/chat/route.ts` | `signal: req.signal` su `.stream()` + `cancel() → stream.abort()`. |
| M3 | 🟠 | **Header di sicurezza assenti** (CSP, HSTS, ecc.). | `next.config.mjs` | `headers()` con CSP calibrata, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. |
| L1 | 🟡 | **Confronto del segreto non a tempo costante** (`===`/`!==`). | `auth.ts`, `proxy.ts`, `api/chat`, `api/auth` | `crypto.timingSafeEqual` via `safeEqual()` (abilitato dal runtime Node). |
| L2 | 🟡 | **Convenzione `middleware` deprecata in Next 16** (sostituita da `proxy`). | `middleware.ts` → `proxy.ts` | Migrato a `src/proxy.ts` (export `proxy`, stesso `config.matcher`). |
| L3 | 🟡 | **2 advisory *moderate* postcss** via copia bundle interna di Next (XSS `</style>` in build). | `package.json` | `overrides` postcss → `^8.5.10` (deduplica la copia vulnerabile). `npm audit` ora pulito. |
| L4 | 🟡 | **Nessun controllo same-origin** sulle route che cambiano stato (già mitigato da `SameSite=Lax`). | `lib/request.ts`, `api/auth`, `api/chat` | Controllo `Origin`/`Host` (`sameOrigin()`) come difesa in profondità. |

### Conferme positive (nessuna azione necessaria)

- **Chiave API**: usata solo in `api/chat/route.ts` (server), mai `NEXT_PUBLIC_`, mai loggata. `.env*` git-ignored; `.env.example` solo placeholder. Verificato: nessun `sk-ant-`/nome env nel bundle client.
- **Output del modello**: reso come children JSX (React escapa). Nessun `dangerouslySetInnerHTML` su output del modello/utente (l'unico è lo script statico di registrazione SW in `layout.tsx`). La CSP aggiunge una rete di sicurezza in più.
- **Service worker**: esclude `/api/` e i non-GET dalla cache; memorizza solo shell pubblica + asset (`public/sw.js`).
- **`max_tokens` e system prompt**: fissati lato server; il client non può sovrascriverli né esfiltrare il prompt.

---

## 3. File modificati / aggiunti

```
src/lib/auth.ts          (riscritto)  HMAC token a senso unico + safeEqual + isValidToken
src/proxy.ts             (NUOVO)      gate password (ex middleware.ts) — runtime Node
src/middleware.ts        (RIMOSSO)    sostituito da proxy.ts
src/lib/request.ts       (NUOVO)      helper clientIp() + sameOrigin()
src/app/api/auth/route.ts (modif.)    rate-limit + same-origin + confronto a tempo costante
src/app/api/chat/route.ts (modif.)    bound input + abort stream + auth a tempo costante + same-origin
src/lib/constants.ts     (modif.)     limiti di input per la chat
src/lib/rateLimit.ts     (modif.)     documentazione del limite serverless
next.config.mjs          (modif.)     header di sicurezza (CSP, HSTS, …)
package.json             (modif.)     postcss ^8.5.10 + overrides
```

### La questione versione Next, risolta

`package.json`, lockfile e `node_modules` puntano tutti a **Next 16.2.9** (non 14). Direttiva applicata: *restare sulla versione che il codice target-izza, patchata*. Quindi **Next 16.2.9** (ultima stabile della 16.x; la 16.3.0 è solo preview) e migrazione `middleware → proxy`, la convenzione attuale di Next 16. Bonus: `proxy` gira su runtime Node.js, che abilita `crypto.timingSafeEqual` (L1). Nessun `npm audit fix --force`, nessun upgrade major non vincolato.

> ⚠️ **Effetto una tantum:** il token cookie è cambiato (base64 → HMAC) e la sua etichetta è `v2`. Tutti i cookie esistenti si invalidano: ogni utente reinserisce la password **una volta**. Lo stesso accade ruotando `APP_PASSWORD`.

---

## 4. Rischi residui / accettati

- **R1 — Rate-limiter non durevole (da H3).** Resta in-memory per-istanza: su Vercel non si condivide tra lambda. Mitigazione attuale: bound di costo per-richiesta (H2) + `MAX_TOKENS=1500` + gate auth, così una password trapelata non può comunque far esplodere il conto in una singola chiamata. **Upgrade consigliato se si nota abuso:** sostituire lo store di `rateLimit.ts` con Vercel KV / Upstash Redis (`INCR`+`EXPIRE` atomici), mantenendo la firma `rateLimit()`.
- **R2 — CSP con `'unsafe-inline'`.** L'app usa stili inline ovunque e un piccolo script inline (registrazione SW), oltre agli script inline di hydration di Next. Per non rompere l'app si è scelto `'unsafe-inline'` su `script-src`/`style-src`. Una CSP a *nonce* (più stretta) richiederebbe di rifattorizzare l'UI inline e propagare un nonce dal `proxy`: sproporzionato per uno strumento di famiglia. `'unsafe-eval'` e i websocket sono ammessi **solo in sviluppo** (HMR), mai in produzione.
- **R3 — Pin di postcss via `overrides`.** Forziamo la copia bundle di Next a postcss `^8.5.10` (semver-compatibile con la 8.4 pinnata da Next). Quando una release **stabile** di Next 16.x integrerà il fix, l'`overrides` potrà essere rimosso.
- **R4 — Modello a singola password.** Nessuna identità per-utente, fattore unico. Accettabile per uso familiare. Usare una `APP_PASSWORD` **lunga e unica** (non riusata altrove).
- **R5 — Warning `eslint` in `next.config.mjs`.** Next 16 non riconosce più la chiave `eslint` (la lint è stata spostata): produce un warning innocuo in build, senza impatto. Lasciata invariata (fuori scope sicurezza).
- **R6 — SW cache della shell autenticata `/`.** La shell non contiene segreti e il piano pasti non è sensibile: accettabile.
- **R7 — `@anthropic-ai/sdk@0.32.1`.** Datato ma senza vulnerabilità note (`npm audit` pulito); mantenuto per non introdurre cambi di dipendenza non necessari. Supporta già `signal`/`abort()` usati per M2.

---

## 5. Checklist di deploy

**Variabili d'ambiente (Vercel → Settings → Environment Variables)**
- [ ] `ANTHROPIC_API_KEY` — solo lato server. **Mai** con prefisso `NEXT_PUBLIC_`. Impostala su *Production*, *Preview* e *Development*.
- [ ] `APP_PASSWORD` — password condivisa **lunga e unica**. Stessi tre ambienti.
- [ ] `.env` / `.env*.local` **mai** committati (già in `.gitignore`). `.env.example` contiene solo placeholder.
- [ ] Ruotare `APP_PASSWORD` quando serve: invalida tutti i cookie → ri-login una volta.

**Protezione dei Preview deployment**
- [ ] Gli URL *Preview* di Vercel sono pubblici per default. Il gate dell'app li copre **solo se** `APP_PASSWORD` è impostata anche sull'ambiente Preview (vedi sopra).
- [ ] Consigliato in più: Vercel → **Deployment Protection** (Vercel Authentication / password) su *Preview* (e *Production*), così gli URL non gateati non restano esposti.

**Header di sicurezza**
- [ ] Applicati automaticamente da `next.config.mjs` (`headers()`): CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`. Nessuna azione manuale.
- [ ] Se in futuro aggiungi font/CDN/script esterni, **aggiorna la CSP** in `next.config.mjs` (altrimenti verranno bloccati).

**Verifica post-deploy (rapida)**
- [ ] `curl -I https://<app>/login` → presenti `Content-Security-Policy` e `Strict-Transport-Security`.
- [ ] `curl -X POST https://<app>/api/chat` (senza cookie) → **401**.
- [ ] Login con password corretta → cookie `Secure; HttpOnly; SameSite=Lax` il cui valore **non** è la password.
- [ ] `npm audit` → 0 vulnerabilità Critical/High.
