"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PLAN } from "@/data/plan";
import type { Tag, ThemeName, Meal, RefBlock } from "@/data/types";

/* ---------- design tokens ---------- */
type Pal = { accent: string; accentStrong: string; accentText: string; bg: string; chipBg: string; surface: string; surface2: string };
const THEMES: Record<ThemeName, { light: Pal; dark: Pal }> = {
  bento: {
    light: { accent: "#C8623B", accentStrong: "#A14A2A", accentText: "#8C4023", bg: "#F4F1E9", chipBg: "#EFE2D6", surface: "#FCFBF8", surface2: "#F4F0E7" },
    dark: { accent: "#DB7A4F", accentStrong: "#BC5A33", accentText: "#E7A481", bg: "#1A1613", chipBg: "#2C2520", surface: "#221D19", surface2: "#2A241F" }
  },
  laguna: {
    light: { accent: "#5E9E95", accentStrong: "#3C615C", accentText: "#356057", bg: "#EBEBE0", chipBg: "#DAE6DD", surface: "#FCFBF8", surface2: "#EDEDE3" },
    dark: { accent: "#74B7AD", accentStrong: "#437168", accentText: "#92C8BE", bg: "#131815", chipBg: "#1F2A25", surface: "#1A211D", surface2: "#232C27" }
  },
  pozzetto: {
    light: { accent: "#3E83A3", accentStrong: "#2E5A72", accentText: "#255067", bg: "#E8F0F5", chipBg: "#D6E5EF", surface: "#FCFBF8", surface2: "#E6EEF3" },
    dark: { accent: "#61A6C6", accentStrong: "#36708E", accentText: "#86BEDA", bg: "#131A1F", chipBg: "#1C2A33", surface: "#1A2127", surface2: "#232C33" }
  }
};
const NEUTRAL = {
  light: { ink: "#1C1E22", inkSoft: "#4C4F55", muted: "#7C7F86", line: "rgba(28,30,34,0.11)" },
  dark: { ink: "#ECE9E3", inkSoft: "#B3B1AB", muted: "#95938C", line: "rgba(255,255,255,0.13)" }
};
const TAGS: Record<Tag, { label: string; text: string; chip: string }> = {
  congelabile: { label: "Congelabile", text: "#255067", chip: "#DAE8F1" },
  fresco: { label: "Fresco", text: "#356057", chip: "#DCE7DE" },
  assembla: { label: "Assembla", text: "#8C4023", chip: "#F0E2D5" }
};
const DOW = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const MONTHS = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

type Slot = "lunch" | "dinner";
type DishRef = { weekIdx: number; dayKey: string; slot: Slot } | null;
type CustomItem = { id: string; name: string; format: string };
type ChatMsg = { role: "user" | "assistant"; content: string; raw?: string; bimby?: string | null; error?: boolean };
type FilterDef = { id: string; label: string; kw: string[] };
type ThemeMode = "auto" | "light" | "dark";
type TimerState = { label: string; totalSec: number; remainingSec: number; running: boolean; endAt: number };

/* ---------- localStorage helpers ---------- */
function ls<T>(k: string): T | null {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
function save(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

/* ---------- Bimby block parsing (live during stream) ---------- */
function parseBimby(t: string): { clean: string; bimby: string | null } {
  const a = t.indexOf("[[BIMBY]]");
  if (a < 0) return { clean: t, bimby: null };
  const b = t.indexOf("[[/BIMBY]]");
  const before = t.slice(0, a).trim();
  if (b > a) {
    const inner = t.slice(a + 9, b).trim();
    return { clean: before || "Ecco la ricetta. Trovi il blocco pronto per Bimby qui sotto.", bimby: inner };
  }
  const inner = t.slice(a + 9).trim();
  return { clean: before || "Preparo la ricetta…", bimby: inner || " " };
}

const HEART = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
function Heart({ filled, size = 18 }: { filled: boolean; size?: number }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d={HEART} /></svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={HEART} /></svg>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<string>("rotazione");
  const [weekIdx, setWeekIdx] = useState(0);
  const [dayKey, setDayKey] = useState("lun");
  const [dish, setDish] = useState<DishRef>(null);
  const [refId, setRefId] = useState<string | null>(null);

  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [custom, setCustom] = useState<Record<number, CustomItem[]>>({});
  const [pantryOpen, setPantryOpen] = useState<{ base: boolean; fusion: boolean }>({ base: false, fusion: false });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [customFilters, setCustomFilters] = useState<FilterDef[]>([]);
  const [filterInput, setFilterInput] = useState("");

  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(-1);

  const [newItemName, setNewItemName] = useState("");
  const [newItemFormat, setNewItemFormat] = useState("");

  // P1
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [sysDark, setSysDark] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [searchCuisine, setSearchCuisine] = useState<string[]>([]);
  const [searchEquip, setSearchEquip] = useState<string[]>([]);
  const [searchFavsOnly, setSearchFavsOnly] = useState(false);
  const [dishServings, setDishServings] = useState(4);
  const [todayWeek, setTodayWeekState] = useState(0);
  const [timer, setTimer] = useState<TimerState | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  /* hydrate from storage + today */
  useEffect(() => {
    setMounted(true);
    try {
      const k = DOW[new Date().getDay()];
      if (k) setDayKey(k);
    } catch {
      /* ignore */
    }
    const c = ls<Record<string, boolean>>("cucina.checks.v1");
    if (c) setChecks(c);
    const cu = ls<Record<number, CustomItem[]>>("cucina.custom.v1");
    if (cu) setCustom(cu);
    const f = ls<{ active: string[]; custom: FilterDef[] }>("cucina.filters.v1");
    if (f) {
      setActiveFilters(f.active || []);
      setCustomFilters(f.custom || []);
    }
    const fav = ls<Record<string, boolean>>("cucina.favs.v1");
    if (fav) setFavs(fav);
    const tm = ls<ThemeMode>("cucina.theme.v1");
    if (tm) setThemeMode(tm);
    const tw = ls<number>("cucina.todayWeek.v1");
    if (typeof tw === "number") setTodayWeekState(tw);
    const tmr = ls<TimerState>("cucina.timer.v1");
    if (tmr) {
      if (tmr.running && tmr.endAt) {
        const rem = Math.max(0, Math.round((tmr.endAt - Date.now()) / 1000));
        setTimer({ ...tmr, remainingSec: rem, running: rem > 0 });
      } else setTimer(tmr);
    }
    const ui = ls<{ tab?: string; weekIdx?: number; dayKey?: string }>("cucina.ui.v1");
    if (ui) {
      if (ui.tab) setTab(ui.tab);
      if (typeof ui.weekIdx === "number") setWeekIdx(ui.weekIdx);
      if (ui.dayKey) setDayKey(ui.dayKey);
    }
  }, []);

  /* prefers-color-scheme */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSysDark(mq.matches);
    const h = (e: MediaQueryListEvent) => setSysDark(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", h);
    else mq.addListener(h);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", h);
      else mq.removeListener(h);
    };
  }, []);

  /* timer tick — drives the countdown once per second */
  useEffect(() => {
    const id = setInterval(() => {
      setTimer((t) => {
        if (!t || !t.running) return t;
        const rem = Math.max(0, Math.round((t.endAt - Date.now()) / 1000));
        if (rem === t.remainingSec && rem > 0) return t;
        const nt = { ...t, remainingSec: rem, running: rem > 0 };
        save("cucina.timer.v1", nt);
        return nt;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* theme resolution */
  const themeName: ThemeName = useMemo(() => {
    if (dish) return "bento";
    if (refId) {
      const r = PLAN.reference.find((x) => x.id === refId);
      return (r?.theme as ThemeName) || "bento";
    }
    if (tab === "spesa") return "laguna";
    return "bento";
  }, [dish, refId, tab]);
  const dark = themeMode === "dark" || (themeMode === "auto" && sysDark);
  const pal = THEMES[themeName][dark ? "dark" : "light"];
  const nu = NEUTRAL[dark ? "dark" : "light"];
  const rootVars = {
    ["--accent" as string]: pal.accent,
    ["--accent-strong" as string]: pal.accentStrong,
    ["--accent-text" as string]: pal.accentText,
    ["--bg" as string]: pal.bg,
    ["--chip-bg" as string]: pal.chipBg,
    ["--surface" as string]: pal.surface,
    ["--surface-2" as string]: pal.surface2,
    ["--ink" as string]: nu.ink,
    ["--ink-soft" as string]: nu.inkSoft,
    ["--muted" as string]: nu.muted,
    ["--line" as string]: nu.line
  } as React.CSSProperties;

  /* helpers */
  const allFilters = (): FilterDef[] => PLAN.filters.concat(customFilters);
  const activeLabels = () => {
    const defs = allFilters();
    return activeFilters.map((id) => defs.find((d) => d.id === id)?.label).filter(Boolean) as string[];
  };
  const clashFor = (m: Meal): string[] => {
    const hay = `${m.name} ${m.note || ""}`.toLowerCase();
    const defs = allFilters();
    const out: string[] = [];
    for (const id of activeFilters) {
      const d = defs.find((x) => x.id === id);
      if (d && d.kw.some((k) => hay.includes(k.toLowerCase()))) out.push(d.label);
    }
    return out;
  };
  const isFav = (name: string) => !!favs[name];
  const toggleFav = (name: string) =>
    setFavs((f) => {
      const n = { ...f };
      if (n[name]) delete n[name];
      else n[name] = true;
      save("cucina.favs.v1", n);
      return n;
    });

  const scrollTop = () => setTimeout(() => mainRef.current?.scrollTo({ top: 0 }), 20);
  const scrollChat = () => setTimeout(() => chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight }), 40);
  const saveUi = (t: string, w: number, d: string) => save("cucina.ui.v1", { tab: t, weekIdx: w, dayKey: d });

  const goTab = (t: string) => {
    setTab(t);
    setDish(null);
    setRefId(null);
    saveUi(t, weekIdx, dayKey);
    scrollTop();
  };
  const goWeek = (i: number) => {
    setWeekIdx(i);
    saveUi(tab, i, dayKey);
  };
  const goDay = (k: string) => {
    setDayKey(k);
    saveUi(tab, weekIdx, k);
  };
  const openDish = (weekIdxArg: number, dKey: string, slot: Slot) => {
    setDish({ weekIdx: weekIdxArg, dayKey: dKey, slot });
    setDishServings(4);
    scrollTop();
  };
  const openRef = (id: string) => {
    setRefId(id);
    setTab("note");
    scrollTop();
  };
  const back = () => {
    setDish(null);
    setRefId(null);
    scrollTop();
  };
  const cycleTheme = () =>
    setThemeMode((m) => {
      const order: ThemeMode[] = ["auto", "light", "dark"];
      const next = order[(order.indexOf(m) + 1) % 3];
      save("cucina.theme.v1", next);
      return next;
    });
  const changeServings = (delta: number) => setDishServings((n) => Math.max(1, Math.min(12, n + delta)));
  const setTodayWeek = (i: number) => {
    setTodayWeekState(i);
    save("cucina.todayWeek.v1", i);
  };
  const parsePrep = (s: string) => {
    const nums = (s.match(/\d+/g) || []).map(Number).filter((n) => n > 0 && n <= 180);
    return nums.length ? nums.reduce((a, b) => a + b, 0) : 0;
  };
  const startTimer = (label: string, mins: number) => {
    if (!mins || mins <= 0) return;
    const total = mins * 60;
    const nt: TimerState = { label, totalSec: total, remainingSec: total, running: true, endAt: Date.now() + total * 1000 };
    setTimer(nt);
    save("cucina.timer.v1", nt);
  };
  const toggleTimer = () =>
    setTimer((t) => {
      if (!t) return t;
      let nt: TimerState;
      if (t.running) nt = { ...t, running: false, remainingSec: Math.max(0, Math.round((t.endAt - Date.now()) / 1000)) };
      else if (t.remainingSec <= 0) nt = { ...t, running: true, remainingSec: t.totalSec, endAt: Date.now() + t.totalSec * 1000 };
      else nt = { ...t, running: true, endAt: Date.now() + t.remainingSec * 1000 };
      save("cucina.timer.v1", nt);
      return nt;
    });
  const addMinute = () =>
    setTimer((t) => {
      if (!t) return t;
      const rem = (t.running ? Math.max(0, Math.round((t.endAt - Date.now()) / 1000)) : t.remainingSec) + 60;
      const nt: TimerState = { ...t, remainingSec: rem, totalSec: Math.max(t.totalSec, rem), running: true, endAt: Date.now() + rem * 1000 };
      save("cucina.timer.v1", nt);
      return nt;
    });
  const closeTimer = () => {
    setTimer(null);
    save("cucina.timer.v1", null);
  };

  const toggleCheck = (key: string) =>
    setChecks((c) => {
      const n = { ...c };
      if (n[key]) delete n[key];
      else n[key] = true;
      save("cucina.checks.v1", n);
      return n;
    });
  const clearWeek = (n: number) =>
    setChecks((c) => {
      const n2 = { ...c };
      Object.keys(n2).forEach((k) => {
        if (k.startsWith(`w${n}::`)) delete n2[k];
      });
      (custom[n] || []).forEach((it) => delete n2[`cust::${it.id}`]);
      save("cucina.checks.v1", n2);
      return n2;
    });
  const addCustom = (n: number) => {
    if (!newItemName.trim()) return;
    setCustom((cu) => {
      const arr = (cu[n] || []).slice();
      arr.push({ id: "ci" + Date.now() + Math.floor(Math.random() * 1000), name: newItemName.trim(), format: newItemFormat.trim() });
      const ncu = { ...cu, [n]: arr };
      save("cucina.custom.v1", ncu);
      return ncu;
    });
    setNewItemName("");
    setNewItemFormat("");
  };
  const removeCustom = (n: number, idx: number) => {
    const item = (custom[n] || [])[idx];
    setCustom((cu) => {
      const arr = (cu[n] || []).slice();
      arr.splice(idx, 1);
      const ncu = { ...cu, [n]: arr };
      save("cucina.custom.v1", ncu);
      return ncu;
    });
    if (item)
      setChecks((c) => {
        const n2 = { ...c };
        delete n2[`cust::${item.id}`];
        save("cucina.checks.v1", n2);
        return n2;
      });
  };

  const toggleFilter = (id: string) =>
    setActiveFilters((a) => {
      const na = a.includes(id) ? a.filter((x) => x !== id) : [...a, id];
      save("cucina.filters.v1", { active: na, custom: customFilters });
      return na;
    });
  const addFilter = () => {
    const t = filterInput.trim();
    if (!t) return;
    const id = "cf-" + t.toLowerCase().replace(/\s+/g, "-");
    const ndefs = customFilters.find((d) => d.id === id) ? customFilters : [...customFilters, { id, label: t, kw: [t.toLowerCase()] }];
    const na = activeFilters.includes(id) ? activeFilters : [...activeFilters, id];
    setCustomFilters(ndefs);
    setActiveFilters(na);
    setFilterInput("");
    save("cucina.filters.v1", { active: na, custom: ndefs });
  };
  const toggleIn = (arr: string[], set: (v: string[]) => void, val: string) => set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  const clearSearch = () => {
    setSearchQ("");
    setSearchTags([]);
    setSearchCuisine([]);
    setSearchEquip([]);
    setSearchFavsOnly(false);
  };

  const seedRecipe = (name: string) => {
    const per = dishServings !== 4 ? ` per ${dishServings} persone` : "";
    goTab("ricette");
    setChatInput(`Dammi la ricetta completa per: ${name}${per}`);
    setTimeout(() => chatInputRef.current?.focus(), 80);
  };
  const seedVariant = (name: string) => {
    const per = dishServings !== 4 ? `, per ${dishServings} persone` : "";
    goTab("ricette");
    setChatInput(`Proponi una variante di: ${name}, mantenendo il profilo digeribile e fusion${per}.`);
    setTimeout(() => chatInputRef.current?.focus(), 80);
  };

  const copyBimby = (idx: number, text: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx((c) => (c === idx ? -1 : c)), 1600);
  };

  const send = async (textArg?: string) => {
    const text = (textArg ?? chatInput).trim();
    if (!text || sending) return;
    const base: ChatMsg[] = [...chat, { role: "user", content: text }];
    setChat(base);
    setChatInput("");
    setSending(true);
    scrollChat();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: base.map((m) => ({ role: m.role, content: m.raw || m.content })),
          filters: activeLabels()
        })
      });
      if (!res.ok || !res.body) {
        const msg = res.status === 429 ? "Troppi messaggi, riprova tra poco." : "Non sono riuscito a rispondere adesso. Riprova tra un momento.";
        setChat((c) => [...c, { role: "assistant", content: msg, raw: msg, bimby: null, error: true }]);
        setSending(false);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      setChat((c) => [...c, { role: "assistant", content: "", raw: "" }]);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const parsed = parseBimby(acc);
        setChat((c) => {
          const cp = c.slice();
          cp[cp.length - 1] = { role: "assistant", content: parsed.clean, raw: acc, bimby: parsed.bimby };
          return cp;
        });
        scrollChat();
      }
      setSending(false);
      scrollChat();
    } catch {
      setChat((c) => [...c, { role: "assistant", content: "Connessione assente. La chat richiede internet.", raw: "", bimby: null, error: true }]);
      setSending(false);
    }
  };

  /* ---------- derived ---------- */
  const week = PLAN.weeks[weekIdx] || PLAN.weeks[0];
  const today = mounted ? DOW[new Date().getDay()] : "";
  const day = week.days.find((d) => d.key === dayKey) || week.days[0];
  const twWeek = PLAN.weeks[todayWeek] || PLAN.weeks[0];
  const todayDayObj = twWeek.days.find((d) => d.key === today) || twWeek.days[0];
  const nowDate = mounted ? new Date() : null;
  const todayMeta = { dayFull: todayDayObj.full, date: nowDate ? `${nowDate.getDate()} ${MONTHS[nowDate.getMonth()]}` : "", day: todayDayObj };

  const showDish = !!dish;
  const showRef = !!refId;
  const showRotazione = !showDish && !showRef && tab === "rotazione";
  const showSpesa = !showDish && !showRef && tab === "spesa";
  const showCerca = !showDish && !showRef && tab === "cerca";
  const showRicette = !showDish && !showRef && tab === "ricette";
  const showNote = !showDish && !showRef && tab === "note";

  const dateLabel = mounted ? `${DOW[new Date().getDay()]} ${new Date().getDate()} ${MONTHS[new Date().getMonth()]}` : "";

  /* header */
  let hk = "",
    ht = "",
    hs = "",
    showBack = false,
    titleSize = 30,
    titleLh = 1.05;
  if (showDish && dish) {
    const dw = PLAN.weeks[dish.weekIdx];
    const dd = dw.days.find((x) => x.key === dish.dayKey)!;
    const dm = dd[dish.slot];
    hk = `${dd.full} · ${dish.slot === "lunch" ? "Pranzo" : "Cena"}`;
    ht = dm.name;
    hs = `Settimana ${dw.n}`;
    showBack = true;
    titleSize = 21;
    titleLh = 1.2;
  } else if (showRef && refId) {
    const r = PLAN.reference.find((x) => x.id === refId)!;
    hk = r.kicker;
    ht = r.title;
    hs = r.summary;
    showBack = true;
    titleSize = 25;
    titleLh = 1.1;
  } else if (showRotazione) {
    hk = "Rotazione · Estate";
    ht = `Settimana ${week.n}`;
    hs = week.theme;
  } else if (showSpesa) {
    hk = "Spesa";
    ht = `Settimana ${week.n}`;
    hs = "Lista per reparto";
  } else if (showCerca) {
    hk = "Cerca";
    ht = "Trova un piatto";
    hs = "Tra tutte le 4 settimane";
  } else if (showRicette) {
    hk = "Ricette · Chat";
    ht = "Chiedi a Claude";
    hs = "Conosce il tuo piano e i tuoi vincoli";
  } else {
    hk = "Note";
    ht = "Riferimenti";
    hs = "Batch, freezer, digeribilità";
  }

  const sendDisabled = sending || !chatInput.trim();

  /* ---------- style atoms ---------- */
  const S = { surface: "var(--surface)", line: "var(--line)", ink: "var(--ink)", inkSoft: "var(--ink-soft)", muted: "var(--muted)" };
  const mono = (size: number, color = S.inkSoft, ls2 = ".05em"): React.CSSProperties => ({ fontFamily: "'Spline Sans Mono', monospace", fontSize: size, color, letterSpacing: ls2 });
  const selChip = (active: boolean): React.CSSProperties =>
    active
      ? { background: "var(--accent-strong)", color: "#fff", borderColor: "var(--accent-strong)" }
      : { background: "var(--surface)", color: "var(--ink-soft)", borderColor: "var(--line)" };
  const tagChipStyle = (tag: Tag): React.CSSProperties => ({ background: TAGS[tag].chip, color: TAGS[tag].text });
  const cuisinePill: React.CSSProperties = { ...mono(10, S.inkSoft, ".06em"), textTransform: "uppercase", fontWeight: 600, padding: "5px 9px", borderRadius: 999, border: `1px solid ${S.line}` };
  const pretty = "pretty" as React.CSSProperties["textWrap"];

  if (!mounted) {
    return (
      <div style={{ minHeight: "100dvh", background: "#F4F1E9", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 26, color: "#1C1E22" }}>Cucina Estate</div>
        <div style={mono(13, "#7C7F86")}>Carico la cucina…</div>
      </div>
    );
  }

  /* ---------- view renderers ---------- */
  const favBtn = (name: string, size = 18, boxed = false) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFav(name);
      }}
      aria-label="Salva nei preferiti"
      data-tw
      style={
        boxed
          ? { flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 11, border: `1px solid ${S.line}`, background: S.surface, cursor: "pointer", color: "var(--accent-text)" }
          : { display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", padding: 3, margin: -3, cursor: "pointer", color: "var(--accent-text)" }
      }
    >
      <Heart filled={isFav(name)} size={size} />
    </button>
  );

  const dishRowOpen = (weekIdxArg: number, dKey: string, slot: Slot) => () => openDish(weekIdxArg, dKey, slot);
  const keyOpen = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  const card = (weekIdxArg: number, dKey: string, slot: Slot) => {
    const w = PLAN.weeks[weekIdxArg];
    const dy = w.days.find((x) => x.key === dKey)!;
    const m = dy[slot];
    const clash = clashFor(m);
    const open = dishRowOpen(weekIdxArg, dKey, slot);
    return (
      <div
        key={slot}
        role="button"
        tabIndex={0}
        data-tw
        onClick={open}
        onKeyDown={keyOpen(open)}
        style={{ width: "100%", textAlign: "left", background: S.surface, border: `1px solid ${S.line}`, borderRadius: 16, padding: "15px 16px", display: "flex", flexDirection: "column", gap: 10, cursor: "pointer", boxShadow: "0 1px 2px rgba(28,30,34,.04)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{ ...mono(11, S.muted, ".14em"), textTransform: "uppercase", fontWeight: 600 }}>{slot === "lunch" ? "Pranzo" : "Cena"}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ ...mono(10.5, undefined, ".05em"), textTransform: "uppercase", fontWeight: 600, padding: "4px 9px", borderRadius: 999, ...tagChipStyle(m.tag) }}>{TAGS[m.tag].label}</span>
            {favBtn(m.name)}
          </div>
        </div>
        <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 16.5, lineHeight: 1.32, color: S.ink, textWrap: pretty }}>{m.name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
          <span data-tw style={{ ...mono(12, "var(--accent-text)"), padding: "3px 8px", borderRadius: 7, background: "var(--chip-bg)" }}>{m.prepTime}</span>
          {m.equipment.map((eq) => (
            <span key={eq} style={{ ...mono(12), padding: "3px 8px", borderRadius: 7, border: `1px solid ${S.line}` }}>{eq}</span>
          ))}
        </div>
        {clash.length > 0 && (
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 12, lineHeight: 1.4, color: "#8a4b12", background: "#fbeedd", border: "1px solid #f0d9b8", padding: "6px 9px", borderRadius: 8 }}>Possibile conflitto: {clash.join(" · ")}</div>
        )}
      </div>
    );
  };

  const weekChips = (
    <div style={{ display: "flex", gap: 7 }}>
      {PLAN.weeks.map((w, i) => (
        <button key={w.n} data-tw onClick={() => goWeek(i)} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1px solid", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", ...selChip(i === weekIdx) }}>
          {w.n}
        </button>
      ))}
    </div>
  );

  const renderRotazione = () => (
    <div data-screen-label="Rotazione" style={{ padding: "16px 18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div data-tw style={{ background: "var(--chip-bg)", border: `1px solid ${S.line}`, borderRadius: 16, padding: "14px 15px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div data-tw style={{ ...mono(10.5, "var(--accent-text)", ".13em"), textTransform: "uppercase", fontWeight: 600 }}>Cucina oggi</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 17, color: S.ink, marginTop: 2 }}>{todayMeta.dayFull} <span style={{ color: S.muted, fontWeight: 600, fontSize: 13 }}>{todayMeta.date}</span></div>
          </div>
          <div style={{ flex: "0 0 auto", textAlign: "right" }}>
            <div style={{ ...mono(9, S.muted, ".05em"), textTransform: "uppercase", fontWeight: 600, marginBottom: 5 }}>Sett. di rotazione</div>
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              {PLAN.weeks.map((w, i) => (
                <button key={w.n} data-tw onClick={() => setTodayWeek(i)} style={{ width: 26, height: 26, borderRadius: 8, border: "1px solid", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer", ...selChip(i === todayWeek) }}>{w.n}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {(["lunch", "dinner"] as Slot[]).map((slot) => {
            const m = todayMeta.day[slot];
            const open = dishRowOpen(todayWeek, today, slot);
            return (
              <button key={slot} data-tw onClick={open} style={{ textAlign: "left", background: S.surface, border: `1px solid ${S.line}`, borderRadius: 11, padding: "9px 11px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <span style={{ flex: "0 0 auto", ...mono(9.5, S.muted, ".07em"), textTransform: "uppercase", fontWeight: 600, width: 38 }}>{slot === "lunch" ? "Pranzo" : "Cena"}</span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 13.5, lineHeight: 1.25, color: S.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
                <span style={{ flex: "0 0 auto", width: 8, height: 8, borderRadius: "50%", background: TAGS[m.tag].text }} />
              </button>
            );
          })}
        </div>
      </div>
      {weekChips}
      <div data-noscroll style={{ display: "flex", gap: 7, overflowX: "auto", padding: "1px 0" }}>
        {week.days.map((d) => (
          <button key={d.key} data-tw onClick={() => goDay(d.key)} style={{ flex: "0 0 auto", minWidth: 48, padding: "9px 12px", borderRadius: 11, border: "1px solid", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", position: "relative", ...selChip(d.key === dayKey) }}>
            {d.short}
            {d.key === today && d.key !== dayKey && <span style={{ position: "absolute", top: 5, right: 6, width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />}
          </button>
        ))}
      </div>
      {day.session && <div data-tw style={{ ...mono(10.5, "var(--accent-text)", ".1em"), textTransform: "uppercase", fontWeight: 600 }}>{day.session}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {card(weekIdx, dayKey, "lunch")}
        {card(weekIdx, dayKey, "dinner")}
      </div>
    </div>
  );

  const renderDish = () => {
    if (!dish) return null;
    const w = PLAN.weeks[dish.weekIdx];
    const dd = w.days.find((x) => x.key === dish.dayKey)!;
    const m = dd[dish.slot];
    const clash = clashFor(m);
    const factor = Math.round((dishServings / 4) * 10) / 10;
    const scaleHint = dishServings === 4 ? "dose base" : `≈ ×${factor}`;
    return (
      <div data-screen-label={m.name} data-anim style={{ padding: "16px 18px 26px", display: "flex", flexDirection: "column", gap: 16, animation: "cuFade .28s ease both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
            <span style={{ ...mono(10.5, undefined, ".05em"), textTransform: "uppercase", fontWeight: 600, padding: "5px 10px", borderRadius: 999, ...tagChipStyle(m.tag) }}>{TAGS[m.tag].label}</span>
            {parsePrep(m.prepTime) > 0 ? (
              <button data-tw onClick={() => startTimer(m.name, parsePrep(m.prepTime))} aria-label="Avvia un timer" title="Avvia un timer" style={{ display: "inline-flex", alignItems: "center", gap: 5, ...mono(12, "var(--accent-text)"), padding: "5px 10px", borderRadius: 999, background: "var(--chip-bg)", border: "none", cursor: "pointer" }}>
              {m.prepTime}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 2.5h6" /><circle cx="12" cy="13" r="8" /><path d="M12 13V9.2" /></svg>
              </button>
            ) : (
              <span data-tw style={{ ...mono(12, "var(--accent-text)"), padding: "5px 10px", borderRadius: 999, background: "var(--chip-bg)" }}>{m.prepTime}</span>
            )}
            {(m.cuisine || []).map((cu) => (
              <span key={cu} style={cuisinePill}>{cu}</span>
            ))}
          </div>
          {favBtn(m.name, 20, true)}
        </div>
        <h2 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 24, lineHeight: 1.18, color: S.ink, letterSpacing: "-.015em", textWrap: pretty }}>{m.name}</h2>
        <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 13, color: S.inkSoft }}>
          {dd.full} · {dish.slot === "lunch" ? "Pranzo" : "Cena"} · Settimana {w.n} — {w.theme}
        </div>
        {dd.session && <div data-tw style={{ ...mono(10.5, "var(--accent-text)", ".1em"), textTransform: "uppercase", fontWeight: 600 }}>{dd.session}</div>}
        {m.equipment.length > 0 && (
          <div>
            <div style={{ ...mono(10.5, S.muted, ".1em"), textTransform: "uppercase", fontWeight: 600, marginBottom: 7 }}>Attrezzatura</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {m.equipment.map((eq) => (
                <span key={eq} style={{ ...mono(12.5), padding: "5px 11px", borderRadius: 8, border: `1px solid ${S.line}`, background: S.surface }}>{eq}</span>
              ))}
            </div>
          </div>
        )}
        {m.note && (
          <div data-tw style={{ background: "var(--chip-bg)", border: `1px solid ${S.line}`, borderLeft: "3px solid var(--accent)", borderRadius: 12, padding: "13px 15px" }}>
            <div data-tw style={{ ...mono(10.5, "var(--accent-text)", ".09em"), textTransform: "uppercase", fontWeight: 600, marginBottom: 5 }}>Perché funziona</div>
            <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14, lineHeight: 1.5, color: S.inkSoft, textWrap: pretty }}>{m.note}</div>
          </div>
        )}
        {clash.length > 0 && (
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 13, lineHeight: 1.45, color: "#8a4b12", background: "#fbeedd", border: "1px solid #f0d9b8", padding: "10px 12px", borderRadius: 10 }}>
            Attenzione ai tuoi filtri attivi — possibile conflitto: {clash.join(" · ")}. Chiedi a Claude una variante che li rispetti.
          </div>
        )}
        <div data-tw style={{ background: S.surface, border: `1px solid ${S.line}`, borderRadius: 14, padding: "12px 15px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ ...mono(10.5, S.muted, ".1em"), textTransform: "uppercase", fontWeight: 600 }}>Porzioni</div>
            <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 12.5, lineHeight: 1.35, color: S.inkSoft, marginTop: 3 }}>Base del piano: 3–4 · {scaleHint}</div>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 9 }}>
            <button onClick={() => changeServings(-1)} aria-label="Meno porzioni" data-tw style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${S.line}`, background: "var(--bg)", color: S.ink, fontWeight: 600, fontSize: 18, lineHeight: 1, cursor: "pointer" }}>−</button>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: S.ink, minWidth: 22, textAlign: "center" }}>{dishServings}</span>
            <button onClick={() => changeServings(1)} aria-label="Più porzioni" data-tw style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${S.line}`, background: "var(--bg)", color: S.ink, fontWeight: 600, fontSize: 18, lineHeight: 1, cursor: "pointer" }}>+</button>
          </div>
        </div>
        <div style={{ ...mono(12.5, S.muted), fontFamily: "'Hanken Grotesk', sans-serif", lineHeight: 1.5, textWrap: pretty }}>
          Il piano dà l&apos;idea del piatto. Per gli ingredienti e i passi passo-passo (e il blocco pronto per Bimby) chiedi a Claude. Cambia le porzioni e la richiesta si adatta.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 2 }}>
          <button data-tw onClick={() => seedRecipe(m.name)} style={{ width: "100%", minHeight: 50, background: "var(--accent-strong)", color: "#fff", border: "none", borderRadius: 14, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 15.5, cursor: "pointer" }}>Chiedi la ricetta a Claude</button>
          <button data-tw onClick={() => seedVariant(m.name)} style={{ width: "100%", minHeight: 48, background: "transparent", color: "var(--accent-text)", border: "1.5px solid var(--accent)", borderRadius: 14, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Chiedi una variante</button>
        </div>
      </div>
    );
  };

  const checkBox = (checked: boolean, size = 23, radius = 7) => (
    <span data-tw style={{ flex: "0 0 auto", width: size, height: size, borderRadius: radius, border: "1.5px solid", marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? "var(--accent-strong)" : "var(--bg)", borderColor: checked ? "var(--accent-strong)" : "var(--line)" }}>
      {checked && <span style={{ color: "#fff", fontWeight: 700, fontSize: size > 18 ? 13 : 10, fontFamily: "'Hanken Grotesk', sans-serif" }}>✓</span>}
    </span>
  );

  const renderSpesa = () => {
    const shop = PLAN.shopping.find((x) => x.n === week.n)!;
    let total = 0,
      checked = 0;
    shop.sections.forEach((sec, si) => sec.items.forEach((_, ii) => { total++; if (checks[`w${week.n}::${si}::${ii}`]) checked++; }));
    (custom[week.n] || []).forEach((it) => { total++; if (checks[`cust::${it.id}`]) checked++; });
    const pct = total ? Math.round((checked / total) * 100) : 0;

    return (
      <div data-screen-label="Spesa" style={{ padding: "16px 18px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {weekChips}
        <div style={{ background: S.surface, border: `1px solid ${S.line}`, borderRadius: 14, padding: "13px 15px", display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ ...mono(13, S.ink) }}>{checked}/{total} presi</span>
            <button onClick={() => clearWeek(week.n)} style={{ background: "transparent", border: "none", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 12.5, color: S.muted, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}>Svuota spunte</button>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden" }}>
            <div data-tw style={{ height: "100%", borderRadius: 999, background: "var(--accent)", width: `${pct}%` }} />
          </div>
        </div>

        {shop.sections.map((sec, si) => (
          <div key={sec.reparto} style={{ background: S.surface, border: `1px solid ${S.line}`, borderRadius: 14, padding: "5px 15px 9px" }}>
            <h3 data-tw style={{ margin: "12px 0 2px", ...mono(11, "var(--accent-text)", ".1em"), textTransform: "uppercase", fontWeight: 600 }}>{sec.reparto}</h3>
            {sec.items.map((it, ii) => {
              const key = `w${week.n}::${si}::${ii}`;
              const isC = !!checks[key];
              return (
                <button key={key} onClick={() => toggleCheck(key)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 0", background: "transparent", border: "none", borderTop: `1px solid ${S.line}`, cursor: "pointer" }}>
                  {checkBox(isC)}
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: isC ? S.muted : S.ink, textDecoration: isC ? "line-through" : "none" }}>{it.name}</span>
                    {it.format && <span style={{ display: "block", ...mono(12.5, S.muted), marginTop: 2 }}>{it.format}</span>}
                    {it.use && <span data-tw style={{ display: "block", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 12.5, lineHeight: 1.4, color: "var(--accent-text)", marginTop: 3 }}>↳ {it.use}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        ))}

        <div style={{ background: S.surface, border: `1px solid ${S.line}`, borderRadius: 14, padding: "5px 15px 14px" }}>
          <h3 data-tw style={{ margin: "12px 0 2px", ...mono(11, "var(--accent-text)", ".1em"), textTransform: "uppercase", fontWeight: 600 }}>Extra</h3>
          {(custom[week.n] || []).map((it, idx) => {
            const key = `cust::${it.id}`;
            const isC = !!checks[key];
            return (
              <div key={it.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 0", borderTop: `1px solid ${S.line}` }}>
                <button onClick={() => toggleCheck(key)} style={{ flex: "0 0 auto", background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>{checkBox(isC)}</button>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: isC ? S.muted : S.ink, textDecoration: isC ? "line-through" : "none" }}>{it.name}</span>
                  {it.format && <span style={{ display: "block", ...mono(12.5, S.muted), marginTop: 2 }}>{it.format}</span>}
                </span>
                <button onClick={() => removeCustom(week.n, idx)} aria-label="Rimuovi" style={{ flex: "0 0 auto", background: "transparent", border: "none", color: S.muted, fontSize: 18, lineHeight: 1, cursor: "pointer", padding: "0 4px" }}>×</button>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(week.n); } }} placeholder="Aggiungi prodotto" style={{ flex: 1, minWidth: 0, padding: "10px 12px", border: `1px solid ${S.line}`, borderRadius: 10, background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14, color: S.ink }} />
            <input value={newItemFormat} onChange={(e) => setNewItemFormat(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(week.n); } }} placeholder="formato" style={{ width: 88, flex: "0 0 auto", padding: "10px 10px", border: `1px solid ${S.line}`, borderRadius: 10, background: "var(--bg)", ...mono(12, S.ink) }} />
            <button data-tw onClick={() => addCustom(week.n)} style={{ flex: "0 0 auto", background: "var(--accent-strong)", color: "#fff", border: "none", borderRadius: 10, width: 44, fontWeight: 700, fontSize: 20, cursor: "pointer" }}>+</button>
          </div>
        </div>

        <div data-tw style={{ background: "var(--chip-bg)", border: `1px solid ${S.line}`, borderLeft: "3px solid var(--accent)", borderRadius: 12, padding: "13px 15px" }}>
          <div data-tw style={{ ...mono(10.5, "var(--accent-text)", ".09em"), textTransform: "uppercase", fontWeight: 600, marginBottom: 5 }}>Dove finisce l&apos;avanzo</div>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 13.5, lineHeight: 1.5, color: S.inkSoft, textWrap: pretty }}>{shop.leftover}</div>
        </div>

        {(["base", "fusion"] as const).map((kind) => {
          const p = PLAN.dispensa[kind];
          const open = pantryOpen[kind];
          return (
            <div key={kind} style={{ background: S.surface, border: `1px solid ${S.line}`, borderRadius: 14, overflow: "hidden" }}>
              <button onClick={() => setPantryOpen((po) => ({ ...po, [kind]: !po[kind] }))} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, padding: "14px 15px", background: "transparent", border: "none", cursor: "pointer" }}>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 14, color: S.ink, flex: 1 }}>{p.title}</span>
                <span style={mono(11, S.muted)}>{open ? "nascondi" : "mostra"}</span>
              </button>
              {open && (
                <div style={{ padding: "0 15px 15px" }}>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 12, lineHeight: 1.45, color: S.muted, marginBottom: 10 }}>{p.note}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {p.items.map((name, i) => {
                      const key = `disp::${kind}::${i}`;
                      const isC = !!checks[key];
                      return (
                        <button key={key} onClick={() => toggleCheck(key)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 11px 6px 7px", borderRadius: 999, border: `1px solid ${S.line}`, background: "var(--bg)", cursor: "pointer" }}>
                          {checkBox(isC, 17, 5)}
                          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 12.5, color: S.ink, textDecoration: isC ? "line-through" : "none" }}>{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCerca = () => {
    const sQ = searchQ.toLowerCase().trim();
    const hasCriteria = !!(sQ || searchTags.length || searchCuisine.length || searchEquip.length || searchFavsOnly);
    type Rec = { m: Meal; wi: number; dKey: string; slot: Slot; wn: number; dShort: string };
    const all: Rec[] = [];
    PLAN.weeks.forEach((w, wi) => w.days.forEach((d) => (["lunch", "dinner"] as Slot[]).forEach((slot) => all.push({ m: d[slot], wi, dKey: d.key, slot, wn: w.n, dShort: d.short }))));
    const match = (r: Rec) => {
      const m = r.m;
      if (sQ && !`${m.name} ${m.note || ""}`.toLowerCase().includes(sQ)) return false;
      if (searchTags.length && !searchTags.includes(m.tag)) return false;
      if (searchCuisine.length && !(m.cuisine || []).some((c) => searchCuisine.includes(c))) return false;
      if (searchEquip.length && !(m.equipment || []).some((e) => searchEquip.includes(e))) return false;
      if (searchFavsOnly && !isFav(m.name)) return false;
      return true;
    };
    const dedupe = (l: Rec[]) => {
      const seen: Record<string, boolean> = {};
      const out: Rec[] = [];
      l.forEach((r) => { if (!seen[r.m.name]) { seen[r.m.name] = true; out.push(r); } });
      return out;
    };
    const matched = hasCriteria ? dedupe(all.filter(match)) : [];
    const favRecs = !hasCriteria ? dedupe(all.filter((r) => isFav(r.m.name))) : [];
    const list = hasCriteria ? matched : favRecs;
    const empty = (hasCriteria && matched.length === 0) || (!hasCriteria && favRecs.length === 0);
    const emptyMsg = hasCriteria
      ? "Nessun piatto con questi filtri. Prova a togliere un filtro o a cambiare ricerca."
      : "Nessun preferito ancora. Tocca il cuore su un piatto per ritrovarlo qui — oppure cerca e filtra qui sopra.";

    const chipRow = (label: string, options: { value: string; label: string }[], active: string[], set: (v: string[]) => void) => (
      <div>
        <div style={{ ...mono(10, S.muted, ".1em"), textTransform: "uppercase", fontWeight: 600, marginBottom: 7 }}>{label}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {options.map((o) => {
            const a = active.includes(o.value);
            return (
              <button key={o.value} data-tw onClick={() => toggleIn(active, set, o.value)} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 12, padding: "6px 11px", borderRadius: 999, border: "1px solid", cursor: "pointer", ...selChip(a) }}>{o.label}</button>
            );
          })}
        </div>
      </div>
    );

    return (
      <div data-screen-label="Cerca" style={{ padding: "16px 18px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Cerca un piatto…" style={{ width: "100%", padding: "12px 14px", border: `1px solid ${S.line}`, borderRadius: 12, background: S.surface, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 15, color: S.ink }} />
        {chipRow("Tag", (["congelabile", "fresco", "assembla"] as Tag[]).map((k) => ({ value: k, label: TAGS[k].label })), searchTags, setSearchTags)}
        {chipRow("Cucina", PLAN.cuisines.map((c) => ({ value: c, label: c })), searchCuisine, setSearchCuisine)}
        {chipRow("Attrezzatura", PLAN.equipment.map((e) => ({ value: e, label: e })), searchEquip, setSearchEquip)}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button data-tw onClick={() => setSearchFavsOnly((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 12, padding: "6px 12px", borderRadius: 999, border: "1px solid", cursor: "pointer", ...selChip(searchFavsOnly) }}>
            <Heart filled size={13} /> Solo preferiti
          </button>
          {hasCriteria && (
            <button onClick={clearSearch} style={{ background: "transparent", border: "none", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 12.5, color: S.muted, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}>Azzera</button>
          )}
        </div>

        {hasCriteria && <div style={{ ...mono(11, S.muted, ".05em"), fontWeight: 600 }}>{list.length} {list.length === 1 ? "piatto" : "piatti"}</div>}
        {!hasCriteria && favRecs.length > 0 && <div style={{ ...mono(11, "var(--accent-text)", ".1em"), textTransform: "uppercase", fontWeight: 600 }}>I tuoi preferiti</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map((r) => {
            const m = r.m;
            const open = dishRowOpen(r.wi, r.dKey, r.slot);
            return (
              <div key={`${r.wi}-${r.dKey}-${r.slot}`} role="button" tabIndex={0} data-tw onClick={open} onKeyDown={keyOpen(open)} style={{ width: "100%", textAlign: "left", background: S.surface, border: `1px solid ${S.line}`, borderRadius: 14, padding: "13px 15px", display: "flex", flexDirection: "column", gap: 8, cursor: "pointer", boxShadow: "0 1px 2px rgba(28,30,34,.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ ...mono(10.5, S.muted, ".06em"), textTransform: "uppercase", fontWeight: 600 }}>{`S${r.wn} · ${r.dShort} · ${r.slot === "lunch" ? "Pranzo" : "Cena"}`}</span>
                  {favBtn(m.name, 17)}
                </div>
                <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 15.5, lineHeight: 1.3, color: S.ink, textWrap: pretty }}>{m.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                  <span style={{ ...mono(10, undefined, ".05em"), textTransform: "uppercase", fontWeight: 600, padding: "3px 8px", borderRadius: 999, ...tagChipStyle(m.tag) }}>{TAGS[m.tag].label}</span>
                  <span data-tw style={{ ...mono(11.5, "var(--accent-text)"), padding: "3px 8px", borderRadius: 7, background: "var(--chip-bg)" }}>{m.prepTime}</span>
                  {(m.cuisine || []).map((cu) => (
                    <span key={cu} style={{ ...mono(10, S.inkSoft, ".05em"), textTransform: "uppercase", fontWeight: 600, padding: "3px 8px", borderRadius: 999, border: `1px solid ${S.line}` }}>{cu}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {empty && <div style={{ padding: "18px 4px", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14, lineHeight: 1.55, color: S.inkSoft, textWrap: pretty }}>{emptyMsg}</div>}
      </div>
    );
  };

  const renderRicette = () => (
    <div data-screen-label="Chat" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div data-tw style={{ flex: "0 0 auto", padding: "11px 18px 12px", borderBottom: `1px solid ${S.line}`, background: "var(--bg)" }}>
        <div style={{ ...mono(10.5, S.muted, ".09em"), textTransform: "uppercase", fontWeight: 600 }}>Filtri · valgono per ogni risposta</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {allFilters().map((d) => {
            const active = activeFilters.includes(d.id);
            return (
              <button key={d.id} data-tw onClick={() => toggleFilter(d.id)} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 12, padding: "6px 11px", borderRadius: 999, border: "1px solid", cursor: "pointer", ...selChip(active) }}>{d.label}</button>
            );
          })}
          <input value={filterInput} onChange={(e) => setFilterInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFilter(); } }} placeholder="+ altro" style={{ width: 84, padding: "6px 11px", border: `1px dashed ${S.muted}`, borderRadius: 999, background: "transparent", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 12, color: S.ink }} />
        </div>
      </div>

      <div ref={chatScrollRef} data-noscroll style={{ flex: "1 1 auto", overflowY: "auto", minHeight: 0, padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 11 }}>
        {chat.length === 0 ? (
          <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: 13, padding: "4px 2px" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 19, lineHeight: 1.2, color: S.ink, textWrap: pretty }}>Chiedi cosa cucinare</div>
            <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14, lineHeight: 1.5, color: S.inkSoft, textWrap: pretty }}>Conosco le 4 settimane, lo stash di salse e i tuoi vincoli. Ti do la ricetta e il blocco pronto per Bimby/Cookidoo.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
              {["Stasera ho solo zucchine e uova, cosa cucino?", `Variante più veloce di: ${day.dinner.name}`, "Cosa preparo nella Sessione A del weekend?", "Spesa extra se sabato siamo in 6"].map((t) => (
                <button key={t} data-tw onClick={() => send(t)} style={{ textAlign: "left", background: S.surface, border: `1px solid ${S.line}`, borderRadius: 12, padding: "12px 14px", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14, lineHeight: 1.4, color: S.ink, cursor: "pointer", textWrap: pretty }}>{t}</button>
              ))}
            </div>
          </div>
        ) : null}

        {chat.map((m, idx) => {
          const isUser = m.role === "user";
          const bubble: React.CSSProperties = isUser
            ? { background: "var(--accent-strong)", color: "#fff", borderBottomRightRadius: 5 }
            : m.error
            ? { background: "#fbeedd", color: "#5b3a16", border: "1px solid #f0d9b8", borderBottomLeftRadius: 5 }
            : { background: "var(--surface)", color: "var(--ink)", border: `1px solid ${S.line}`, borderBottomLeftRadius: 5 };
          return (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: isUser ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "90%", padding: "11px 14px", borderRadius: 16, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14.5, lineHeight: 1.5, whiteSpace: "pre-wrap", textWrap: pretty, ...bubble }}>{m.content}</div>
              {m.bimby && (
                <div data-tw style={{ width: "100%", background: S.surface, border: "1px solid var(--accent)", borderRadius: 14, overflow: "hidden" }}>
                  <div data-tw style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "9px 13px", background: "var(--chip-bg)", borderBottom: "1px solid var(--accent)" }}>
                    <span data-tw style={{ ...mono(10.5, "var(--accent-text)", ".07em"), textTransform: "uppercase", fontWeight: 600 }}>Ricetta per Bimby · Cookidoo</span>
                    <button data-tw onClick={() => copyBimby(idx, m.bimby || "")} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 12, color: "#fff", background: "var(--accent-strong)", border: "none", borderRadius: 8, padding: "6px 11px", cursor: "pointer" }}>{copiedIdx === idx ? "Copiata" : "Copia ricetta"}</button>
                  </div>
                  <pre style={{ margin: 0, padding: 13, ...mono(12.5, S.ink, "0"), lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.bimby}</pre>
                </div>
              )}
            </div>
          );
        })}

        {sending && (
          <div style={{ alignSelf: "flex-start", display: "flex", gap: 4, padding: "13px 15px", background: S.surface, border: `1px solid ${S.line}`, borderRadius: 16 }}>
            {[0, 0.18, 0.36].map((d) => (
              <span key={d} data-anim style={{ width: 7, height: 7, borderRadius: "50%", background: S.muted, animation: `cuBlink 1s infinite ${d}s` }} />
            ))}
          </div>
        )}
      </div>

      <div data-tw style={{ flex: "0 0 auto", padding: "11px 13px", borderTop: `1px solid ${S.line}`, background: "var(--bg)", display: "flex", gap: 9, alignItems: "flex-end" }}>
        <textarea ref={chatInputRef} rows={1} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Scrivi a Claude…" style={{ flex: 1, minWidth: 0, resize: "none", maxHeight: 120, minHeight: 46, padding: "12px 14px", border: `1px solid ${S.line}`, borderRadius: 14, background: S.surface, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 15, lineHeight: 1.4, color: S.ink }} />
        <button data-tw onClick={() => send()} disabled={sendDisabled} style={{ flex: "0 0 auto", width: 46, height: 46, borderRadius: 14, border: "none", background: "var(--accent-strong)", color: "#fff", fontWeight: 700, fontSize: 19, cursor: sendDisabled ? "default" : "pointer", opacity: sendDisabled ? 0.4 : 1 }}>↑</button>
      </div>
    </div>
  );

  const renderNote = () => (
    <div data-screen-label="Riferimenti" style={{ padding: "16px 18px 24px", display: "flex", flexDirection: "column", gap: 11 }}>
      {PLAN.reference.map((r) => (
        <button key={r.id} data-tw onClick={() => openRef(r.id)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 13, background: S.surface, border: `1px solid ${S.line}`, borderRadius: 14, padding: "15px 16px", cursor: "pointer", boxShadow: "0 1px 2px rgba(28,30,34,.04)" }}>
          <span style={{ flex: "0 0 auto", width: 10, height: 10, borderRadius: 3, marginTop: 5, background: THEMES[r.theme][dark ? "dark" : "light"].accent }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", ...mono(10.5, S.muted, ".09em"), textTransform: "uppercase", fontWeight: 600 }}>{r.kicker}</span>
            <span style={{ display: "block", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 17, color: S.ink, marginTop: 3 }}>{r.title}</span>
            <span style={{ display: "block", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 13, lineHeight: 1.45, color: S.inkSoft, marginTop: 4, textWrap: pretty }}>{r.summary}</span>
          </span>
          <span style={{ flex: "0 0 auto", color: S.muted, fontSize: 18, marginTop: 2 }}>›</span>
        </button>
      ))}
    </div>
  );

  const renderBlock = (b: RefBlock, i: number) => (
    <div key={i}>
      {b.title && <h3 style={{ margin: "0 0 10px", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, color: S.ink, letterSpacing: "-.01em" }}>{b.title}</h3>}
      {b.type === "p" && <p style={{ margin: 0, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14.5, lineHeight: 1.55, color: S.inkSoft, textWrap: pretty }}>{b.d}</p>}
      {b.type === "list" && (
        <div>
          {(b.items as { t?: string; d?: string }[]).map((it, k) => (
            <div key={k} style={{ display: "flex", gap: 11, padding: "9px 0", borderTop: `1px solid ${S.line}` }}>
              <span style={{ flex: "0 0 auto", width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", marginTop: 8 }} />
              <div style={{ flex: 1, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14.5, lineHeight: 1.55, color: S.inkSoft, textWrap: pretty }}>
                {it.t && <span style={{ fontWeight: 700, color: S.ink }}>{it.t}</span>}
                {it.t && it.d && <span style={{ color: S.ink }}> — </span>}
                {it.d}
              </div>
            </div>
          ))}
        </div>
      )}
      {b.type === "table" && (
        <div data-noscroll style={{ overflowX: "auto", border: `1px solid ${S.line}`, borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {(b.cols || []).map((col) => (
                  <th key={col} style={{ textAlign: "left", padding: "9px 11px", background: "var(--surface-2)", ...mono(10, S.muted, ".06em"), textTransform: "uppercase", borderBottom: `1px solid ${S.line}`, whiteSpace: "nowrap" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(b.rows || []).map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: "9px 11px", borderTop: `1px solid ${S.line}`, verticalAlign: "top", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: ci === 0 ? 600 : 500, fontSize: 13, lineHeight: 1.4, color: ci === 0 ? S.ink : S.inkSoft }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {b.type === "callout" && (
        <div data-tw style={{ background: "var(--chip-bg)", border: `1px solid ${S.line}`, borderLeft: "3px solid var(--accent)", borderRadius: 12, padding: "13px 15px" }}>
          {b.t && <div data-tw style={{ ...mono(10.5, "var(--accent-text)", ".08em"), textTransform: "uppercase", fontWeight: 600, marginBottom: 5 }}>{b.t}</div>}
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 14, lineHeight: 1.5, color: S.inkSoft, textWrap: pretty }}>{b.d}</div>
        </div>
      )}
      {b.type === "chips" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {(b.items as string[]).map((ch) => (
            <span key={ch} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 12.5, color: S.inkSoft, background: S.surface, border: `1px solid ${S.line}`, padding: "6px 11px", borderRadius: 999 }}>{ch}</span>
          ))}
        </div>
      )}
    </div>
  );

  const renderRef = () => {
    if (!refId) return null;
    const r = PLAN.reference.find((x) => x.id === refId)!;
    return (
      <div data-screen-label={r.title} data-anim style={{ padding: "18px 18px 26px", display: "flex", flexDirection: "column", gap: 16, animation: "cuFade .28s ease both" }}>
        {r.blocks.map((b, i) => renderBlock(b, i))}
      </div>
    );
  };

  const tabBtn = (id: string, label: string, icon: React.ReactNode) => (
    <button data-tw onClick={() => goTab(id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", padding: "7px 0", cursor: "pointer", color: tab === id ? "var(--accent-text)" : "var(--muted)" }}>
      {icon}
      <span style={{ ...mono(10, undefined, ".02em"), color: "inherit", fontWeight: 600 }}>{label}</span>
    </button>
  );

  const themeTitle = themeMode === "auto" ? "Tema: automatico" : themeMode === "light" ? "Tema: chiaro" : "Tema: scuro";
  const themeIcon =
    themeMode === "auto" ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="8.6" /><path d="M12 3.4v17.2" /><path d="M12 6.5a5.5 5.5 0 0 1 0 11Z" fill="currentColor" stroke="none" /></svg>
    ) : themeMode === "light" ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.6v2.3M12 19.1v2.3M21.4 12h-2.3M4.9 12H2.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" /></svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8Z" /></svg>
    );

  return (
    <div data-tw style={{ minHeight: "100dvh", display: "flex", justifyContent: "center", background: "#15171b", color: "var(--ink)", WebkitFontSmoothing: "antialiased", ...rootVars }}>
      <div data-tw style={{ width: "100%", maxWidth: 540, minHeight: "100dvh", height: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <header data-tw style={{ flex: "0 0 auto", background: "var(--bg)", padding: "12px 18px 14px", borderBottom: `1px solid ${S.line}`, zIndex: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minHeight: 24 }}>
            {showBack ? (
              <button data-tw onClick={back} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "none", padding: "4px 6px 4px 0", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 13.5, color: "var(--accent-text)", cursor: "pointer" }}>‹ Indietro</button>
            ) : (
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "-.01em", color: S.ink }}>Cucina Estate</span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <button data-tw onClick={cycleTheme} aria-label="Cambia tema" title={themeTitle} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 9, border: `1px solid ${S.line}`, background: "transparent", color: S.inkSoft, cursor: "pointer" }}>{themeIcon}</button>
              <span style={mono(11.5, S.muted)}>{dateLabel}</span>
            </div>
          </div>
          <div style={{ marginTop: 11 }}>
            <div data-tw style={{ ...mono(11, "var(--accent-text)", ".13em"), textTransform: "uppercase", fontWeight: 600 }}>{hk}</div>
            <h1 style={{ margin: "4px 0 0", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: S.ink, letterSpacing: "-.015em", textWrap: pretty, fontSize: titleSize, lineHeight: titleLh }}>{ht}</h1>
            <div style={{ marginTop: 4, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 13.5, lineHeight: 1.4, color: S.inkSoft, textWrap: pretty }}>{hs}</div>
          </div>
        </header>

        <main ref={mainRef} data-noscroll style={{ flex: "1 1 auto", overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
          {showDish && renderDish()}
          {showRef && renderRef()}
          {showRotazione && renderRotazione()}
          {showSpesa && renderSpesa()}
          {showCerca && renderCerca()}
          {showRicette && renderRicette()}
          {showNote && renderNote()}
        </main>

        {timer &&
          (() => {
            const done = timer.remainingSec <= 0;
            const mm = Math.floor(Math.max(0, timer.remainingSec) / 60);
            const ss = Math.max(0, timer.remainingSec) % 60;
            const clock = `${mm}:${ss < 10 ? "0" : ""}${ss}`;
            const state = timer.running ? "In cottura" : done ? "Pronto!" : "In pausa";
            return (
              <div data-tw style={{ flex: "0 0 auto", color: "#fff", padding: "11px 14px", display: "flex", alignItems: "center", gap: 13, background: done ? "#2E7D5B" : "var(--accent-strong)" }}>
                <span style={{ flex: "0 0 auto", fontFamily: "'Spline Sans Mono', monospace", fontWeight: 700, fontSize: 23, fontVariantNumeric: "tabular-nums" }}>{clock}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Spline Sans Mono', monospace", fontWeight: 600, fontSize: 9.5, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.82 }}>{state}</div>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{timer.label}</div>
                </div>
                <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 6 }}>
                  <button onClick={addMinute} aria-label="Aggiungi un minuto" style={{ background: "rgba(255,255,255,.18)", color: "#fff", border: "none", borderRadius: 8, padding: "0 10px", height: 32, fontFamily: "'Spline Sans Mono', monospace", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>+1′</button>
                  <button onClick={toggleTimer} aria-label="Pausa o riprendi" style={{ background: "rgba(255,255,255,.18)", color: "#fff", border: "none", borderRadius: 8, width: 34, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    {timer.running ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
                    )}
                  </button>
                  <button onClick={closeTimer} aria-label="Chiudi timer" style={{ background: "transparent", color: "#fff", border: "none", fontSize: 20, lineHeight: 1, cursor: "pointer", padding: "0 4px", opacity: 0.85 }}>×</button>
                </div>
              </div>
            );
          })()}

        <nav data-tw style={{ flex: "0 0 auto", display: "flex", background: "var(--surface)", borderTop: `1px solid ${S.line}`, padding: "6px 4px calc(6px + env(safe-area-inset-bottom))" }}>
          {tabBtn("rotazione", "Rotazione", (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><line x1="3.5" y1="9.6" x2="20.5" y2="9.6" /><line x1="8" y1="3" x2="8" y2="6" /><line x1="16" y1="3" x2="16" y2="6" /></svg>
          ))}
          {tabBtn("spesa", "Spesa", (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 8h12l-1 11a2 2 0 0 1-2 1.9H9a2 2 0 0 1-2-1.9L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
          ))}
          {tabBtn("cerca", "Cerca", (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
          ))}
          {tabBtn("ricette", "Ricette", (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 6h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 17h-8.5L6.5 20.2V17H5a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 5 6Z" /></svg>
          ))}
          {tabBtn("note", "Note", (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><line x1="5" y1="8" x2="19" y2="8" /><line x1="5" y1="12" x2="19" y2="12" /><line x1="5" y1="16" x2="14" y2="16" /></svg>
          ))}
        </nav>
      </div>
    </div>
  );
}
