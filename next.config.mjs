/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy calibrata sull'app:
// - l'UI usa stili inline (style={{…}}) e un piccolo script inline (registrazione
//   del service worker) -> 'unsafe-inline' su style/script (vedi SECURITY.md per il
//   compromesso; una CSP a nonce richiederebbe riscrivere l'app);
// - i font arrivano da Google Fonts (googleapis + gstatic);
// - la chat è same-origin -> connect-src 'self';
// - in sviluppo Next usa eval (HMR) e websocket: allentati SOLO in dev.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "manifest-src 'self'",
  "worker-src 'self'",
  "upgrade-insecure-requests"
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  }
];

const nextConfig = {
  reactStrictMode: true,
  // Non bloccare il primo deploy su warning di lint (la type-check resta attiva).
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

export default nextConfig;
