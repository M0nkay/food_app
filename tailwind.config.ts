import type { Config } from "tailwindcss";

// Tailwind is wired up for utility use, but the app's UI is intentionally
// inline-styled (token-driven) so the per-section theme can animate at runtime.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        body: ["'Hanken Grotesk'", "system-ui", "sans-serif"],
        mono: ["'Spline Sans Mono'", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
