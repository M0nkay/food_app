"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        router.replace("/");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Password errata.");
      }
    } catch {
      setError("Qualcosa è andato storto. Riprova.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#F4F1E9",
        color: "#1C1E22",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: 14
        }}
      >
        <div style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#8C4023" }}>
          Cucina · Estate
        </div>
        <h1 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: "-.015em" }}>
          Entra in cucina
        </h1>
        <p style={{ margin: "0 0 4px", fontSize: 14.5, lineHeight: 1.5, color: "#4C4F55" }}>
          Inserisci la password di famiglia per aprire la rotazione, la spesa e la chat.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            padding: "13px 15px",
            borderRadius: 14,
            border: "1px solid rgba(28,30,34,.14)",
            background: "#FCFBF8",
            fontSize: 16,
            color: "#1C1E22"
          }}
        />
        {error ? (
          <div style={{ fontSize: 13.5, color: "#8a4b12", background: "#fbeedd", border: "1px solid #f0d9b8", padding: "9px 12px", borderRadius: 10 }}>
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={busy || !password.trim()}
          style={{
            minHeight: 50,
            borderRadius: 14,
            border: "none",
            background: "#A14A2A",
            color: "#fff",
            fontWeight: 600,
            fontSize: 15.5,
            cursor: busy ? "default" : "pointer",
            opacity: busy || !password.trim() ? 0.5 : 1
          }}
        >
          {busy ? "Apro…" : "Entra"}
        </button>
      </form>
    </main>
  );
}
