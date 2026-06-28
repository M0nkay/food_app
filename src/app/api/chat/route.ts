import Anthropic from "@anthropic-ai/sdk";
import { cookies } from "next/headers";
import {
  CHAT_MODEL,
  MAX_TOKENS,
  MAX_MESSAGES,
  MAX_MESSAGE_CHARS,
  MAX_TOTAL_CHARS,
  MAX_FILTERS,
  MAX_FILTER_CHARS,
  MAX_BODY_BYTES
} from "@/lib/constants";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import { rateLimit } from "@/lib/rateLimit";
import { AUTH_COOKIE, isValidToken } from "@/lib/auth";
import { clientIp, sameOrigin } from "@/lib/request";

export const runtime = "nodejs";
export const maxDuration = 30;

type ClientMessage = { role: "user" | "assistant"; content: string };

// Normalizza e limita i messaggi del client: solo ruoli/contenuti validi,
// lunghezze e numero limitati. Restituisce null se il totale eccede il tetto.
function sanitizeMessages(raw: unknown): ClientMessage[] | null {
  if (!Array.isArray(raw)) return [];
  const out: ClientMessage[] = [];
  // Teniamo solo i più recenti.
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const trimmed = content.slice(0, MAX_MESSAGE_CHARS).trim();
    if (!trimmed) continue;
    out.push({ role, content: trimmed });
  }
  // L'API Anthropic richiede che il primo messaggio sia "user": se il taglio dei
  // più recenti ha lasciato in testa dei turni "assistant", scartali.
  while (out.length && out[0].role === "assistant") out.shift();
  const total = out.reduce((n, m) => n + m.content.length, 0);
  if (total > MAX_TOTAL_CHARS) return null;
  return out;
}

function sanitizeFilters(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const f of raw.slice(0, MAX_FILTERS)) {
    if (typeof f !== "string") continue;
    const t = f.slice(0, MAX_FILTER_CHARS).trim();
    if (t) out.push(t);
  }
  return out;
}

export async function POST(req: Request) {
  // 0. Difesa in profondità anti-CSRF (oltre a SameSite=Lax sul cookie).
  if (!sameOrigin(req)) {
    return new Response("Origine non valida.", { status: 403 });
  }

  // 1. Auth: il cookie deve combaciare (confronto a tempo costante) con quello
  //    derivato da APP_PASSWORD. La route ricontrolla in proprio: niente bypass
  //    chiamandola direttamente.
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!isValidToken(token)) {
    return new Response("Non autorizzato", { status: 401 });
  }

  // 2. Rate limit per IP (ogni messaggio costa).
  //    NB: in-memory per-istanza — su serverless non si condivide tra lambda.
  //    Il vero limite di costo è dato dai bound sul body (sotto) + MAX_TOKENS.
  const rl = rateLimit(`chat:${clientIp(req)}`, 30, 60_000);
  if (!rl.ok) {
    return new Response("Troppi messaggi, riprova tra poco.", {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfter ?? 30) }
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("Manca ANTHROPIC_API_KEY sul server.", { status: 500 });
  }

  // 3. Guardia sulla dimensione del body prima ancora di leggerlo.
  const declaredLen = Number(req.headers.get("content-length") || "0");
  if (declaredLen && declaredLen > MAX_BODY_BYTES) {
    return new Response("Richiesta troppo grande.", { status: 413 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    messages?: unknown;
    filters?: unknown;
  };

  const messages = sanitizeMessages(body.messages);
  if (messages === null) {
    return new Response("Conversazione troppo lunga.", { status: 413 });
  }
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return new Response("Richiesta non valida.", { status: 400 });
  }
  const filters = sanitizeFilters(body.filters);

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // Il system prompt è SEMPRE costruito lato server: il client non può
  // sovrascriverlo né farselo restituire.
  const system = buildSystemPrompt(filters);

  // 4. Stream verso il client. Se il client si disconnette, abortiamo lo stream
  //    upstream così da non continuare a consumare token inutilmente.
  const stream = anthropic.messages.stream(
    {
      model: CHAT_MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages
    },
    { signal: req.signal }
  );

  const encoder = new TextEncoder();
  const rs = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        stream.on("text", (text: string) => {
          controller.enqueue(encoder.encode(text));
        });
        await stream.finalMessage();
      } catch {
        // Nessuno stack trace né dettaglio verso il client.
        if (!stream.aborted) {
          try {
            controller.enqueue(encoder.encode("\n[errore nel generare la risposta]"));
          } catch {
            /* controller già chiuso */
          }
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* già chiuso */
        }
      }
    },
    cancel() {
      // Disconnessione del client: ferma la generazione upstream.
      stream.abort();
    }
  });

  return new Response(rs, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
