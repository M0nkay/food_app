// Modello usato dalla chat. È un'unica costante: cambiala qui per passare a un altro modello.
export const CHAT_MODEL = "claude-sonnet-4-6";
// Per la massima qualità (più costoso), usa invece:
// export const CHAT_MODEL = "claude-opus-4-8";

// Tetto di token in uscita per risposta.
export const MAX_TOKENS = 1500;

// Limiti sul body della richiesta di chat: tengono limitato il costo di OGNI
// chiamata (input token) anche se il rate-limit in-memory non regge su serverless.
export const MAX_MESSAGES = 24; // turni di conversazione tenuti (i più recenti)
export const MAX_MESSAGE_CHARS = 6000; // lunghezza massima per singolo messaggio
export const MAX_TOTAL_CHARS = 24000; // somma massima dei contenuti per richiesta
export const MAX_FILTERS = 12; // numero massimo di filtri attivi
export const MAX_FILTER_CHARS = 60; // lunghezza massima per etichetta filtro
export const MAX_BODY_BYTES = 64 * 1024; // dimensione massima del body (64 KB)
