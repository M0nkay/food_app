# Cucina Estate 🍤🍅

App web (PWA) per gestire una **rotazione di menù di 4 settimane**, la **lista della spesa** e una **chat con Claude** che conosce il piano e i vincoli alimentari di chi la usa. Mobile-first, in italiano, installabile sul telefono e pronta per il deploy su **Vercel**.

Il piano incluso è un **esempio** (cucina italo-giapponese estiva, pensata per uno stomaco sensibile): per usarla con il tuo menù basta sostituire i contenuti in `src/data/plan.ts` — il resto dell'app funziona uguale.

> **Sicurezza.** La chat passa **solo** da una route server: la chiave API Anthropic vive in `ANTHROPIC_API_KEY` e non finisce mai nel client. L'app è protetta da una password condivisa (`APP_PASSWORD`). Nessun segreto è committato nel repo. Dettagli e audit completo in [`SECURITY.md`](./SECURITY.md).

---

## Cosa c'è dentro

- **Rotazione** — settimana 1–4 × giorno → carte di pranzo e cena (tempo, attrezzatura, tag colorato Congelabile / Fresco / Assembla), con il tema della settimana.
- **Dettaglio piatto** — tempo, attrezzatura, tag, la nota «perché funziona», e due azioni che aprono la chat pre-compilata: *Chiedi la ricetta a Claude* e *Chiedi una variante*.
- **Spesa** — per settimana, raggruppata per reparto, con **spunte che restano salvate** (localStorage), note «dove finisce l'avanzo», dispensa di base/fusion richiudibili, *Svuota spunte* e aggiunta di prodotti.
- **Note** — Criteri, Strategia batch (tabella mattoni + sessioni + stash salse), Conservazione & freezer, Note di digeribilità, Colazioni & spuntini, Piccante a parte.
- **Chat con Claude** — risposte in streaming, conosce il piano e i vincoli, **filtri dietetici** attivabili (no fritto, no cipolla, …) che valgono per ogni risposta, e per ogni ricetta un blocco **pronto per Bimby/Cookidoo** con bottone *Copia ricetta*.
- **Cerca** — ricerca testuale e filtri (tag, cucina Giappone/Italia/India/Cina, attrezzatura) su tutti i piatti delle 4 settimane.
- **Preferiti** — tocca il cuore su qualsiasi piatto per ritrovarlo nella scheda Cerca (salvati sul dispositivo).
- **Porzioni** — stepper sul dettaglio piatto che adatta la richiesta a Claude (es. «per 6 persone»).
- **Tema chiaro/scuro** — segue `prefers-color-scheme` con override manuale; l'accento cambia per sezione in entrambi i temi.
- **Firma visiva** — un'unica identità con **accento che cambia per sezione** (terracotta per le ricette, verde laguna per la spesa, azzurro pozzetto per freezer/conservazione) e transizione morbida (rispetta `prefers-reduced-motion`).

Tutti i contenuti vivono in un solo file dati tipizzato: **`src/data/plan.ts`** (modificalo lì per cambiare piatti, spesa o note; i tipi sono in `src/data/types.ts`).

---

## Stack

Next.js (App Router) · TypeScript · Tailwind · `@anthropic-ai/sdk` (route server in streaming) · PWA (manifest + service worker). Nessun database: lo stato per-utente (spunte, filtri, preferiti) sta in `localStorage`.

---

## 1) Avvio in locale

Serve **Node 18.17+** (o 20+).

```bash
npm install
cp .env.example .env.local      # poi compila i valori (.env va bene uguale)
npm run dev                     # http://localhost:3000
```

`.env.local` (è già git-ignored, non finisce su GitHub):

```bash
ANTHROPIC_API_KEY=sk-ant-...        # la tua chiave Anthropic
APP_PASSWORD=una-password-condivisa # quella che condividi con chi usa l'app
```

Apri `http://localhost:3000`, inserisci la password, ed è pronta. (Le variabili vengono lette all'avvio: se modifichi `.env.local`, riavvia `npm run dev`.)

---

## 2) Variabili d'ambiente

| Nome | A cosa serve | Dove |
|---|---|---|
| `ANTHROPIC_API_KEY` | Autentica le chiamate a Claude. **Solo lato server**, mai con prefisso `NEXT_PUBLIC_`. | [console.anthropic.com](https://console.anthropic.com) → API Keys (l'API è prepagata, separata dall'abbonamento) |
| `APP_PASSWORD` | Password condivisa per entrare nell'app. Usane una **lunga e unica**. | La scegli tu |

Il **modello** della chat è un'unica costante in `src/lib/constants.ts`:

```ts
export const CHAT_MODEL = "claude-sonnet-4-6";
// Per risposte più elaborate (più costoso): "claude-opus-4-8"
```

---

## 3) Deploy su Vercel

**Opzione A — dal sito (consigliata)**

1. Metti il progetto su GitHub (`git init && git add . && git commit -m "Cucina Estate" && git push`). Nessun segreto viene committato: `.env*` è ignorato, `.env.example` contiene solo placeholder.
2. Su [vercel.com](https://vercel.com) → **Add New… → Project** → importa il repo (Vercel riconosce Next.js da solo).
3. In **Settings → Environment Variables** aggiungi `ANTHROPIC_API_KEY` e `APP_PASSWORD` per gli ambienti *Production*, *Preview* e *Development*.
4. **Deploy**. Finito.

**Opzione B — da terminale (un comando)**

```bash
npm i -g vercel
vercel            # primo deploy (segui le domande)
vercel env add ANTHROPIC_API_KEY
vercel env add APP_PASSWORD
vercel --prod     # pubblica in produzione
```

Gli URL *Preview* di Vercel sono pubblici per default: il gate li copre solo se `APP_PASSWORD` è impostata anche su quell'ambiente. In più puoi attivare **Vercel → Deployment Protection** su Preview/Production.

Dopo il deploy, apri il sito sul telefono → *Aggiungi a schermata Home* per installarla come app.

---

## 4) Note utili

- **Aggiungere alla home (PWA):** Safari iOS → *Condividi → Aggiungi a Home*; Chrome Android → menu → *Installa app*. La shell e la lista della spesa funzionano anche offline; la chat richiede rete.
- **Cambiare i contenuti:** tutto in `src/data/plan.ts` (settimane, piatti, spesa con note avanzi, dispensa, riferimenti, filtri). I tipi sono in `src/data/types.ts`.
- **Sicurezza:** è uno strumento per piccoli gruppi, non un servizio pubblico ad alto traffico. Auth a cookie firmato (HMAC), confronto a tempo costante, header di sicurezza in `next.config.mjs`, controllo same-origin e bound sul payload della chat. La chiave API non è mai esposta al client. Il rate-limit sulla chat è in-memory per-istanza (`src/lib/rateLimit.ts`): su serverless non si condivide tra lambda — per usi più intensi passa a Vercel KV / Upstash. Vedi [`SECURITY.md`](./SECURITY.md) per finding, fix e rischi residui.
- **Costi:** ogni messaggio consuma dalla tua chiave Anthropic. Per un gruppo piccolo è questione di centesimi con `claude-sonnet-4-6`; conviene comunque impostare un **tetto di spesa** nella Console Anthropic.
- **Icone:** in `public/icons/` ci sono icone segnaposto. Sostituiscile con le tue PNG 192/512 mantenendo i nomi.

---

## Struttura

```
src/
  app/
    layout.tsx              shell, font, registrazione service worker
    page.tsx                l'app (client) — rotazione, spesa, chat, note
    login/page.tsx          gate password
    globals.css             reset + transizioni tema + keyframes
    api/
      auth/route.ts         POST password → cookie firmato (rate-limit + same-origin)
      chat/route.ts         streaming Anthropic (auth + rate limit + bound input + system prompt)
  data/
    plan.ts                 PIANO completo (fonte unica dei contenuti)
    types.ts                tipi
  lib/
    constants.ts            CHAT_MODEL, MAX_TOKENS, limiti input chat
    systemPrompt.ts         costruisce il system prompt (piano + vincoli + filtri)
    rateLimit.ts            limite per-IP sulla chat (in-memory)
    auth.ts                 token HMAC dalla password + confronto a tempo costante
    request.ts              helper clientIp() + sameOrigin()
  proxy.ts                  gate password (convenzione Next 16; le route API ricontrollano in proprio)
next.config.mjs             header di sicurezza (CSP, HSTS, …)
public/
  manifest.webmanifest · sw.js · icons/
SECURITY.md                 audit di sicurezza, fix e checklist di deploy
```

---

## Riuso

È un piccolo progetto personale, condiviso così com'è: clonalo, sostituisci il piano in `src/data/plan.ts` con il tuo, porta la tua chiave Anthropic e una tua password, e sei a posto. Se vuoi permetterne il riuso libero, aggiungi un file `LICENSE` (es. MIT).

Buona cucina. 🥢