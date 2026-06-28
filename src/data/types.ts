export type Tag = "congelabile" | "fresco" | "assembla";
export type ThemeName = "bento" | "laguna" | "pozzetto";

export interface Meal {
  name: string;
  prepTime: string;
  equipment: string[];
  tag: Tag;
  note?: string;
  cuisine: string[];
}

export interface Day {
  key: string;
  short: string;
  full: string;
  session?: string;
  lunch: Meal;
  dinner: Meal;
}

export interface Week {
  n: 1 | 2 | 3 | 4;
  theme: string;
  days: Day[];
}

export interface ShoppingItem {
  name: string;
  format: string;
  use?: string;
}

export interface ShoppingSection {
  reparto: string;
  items: ShoppingItem[];
}

export interface WeekShopping {
  n: 1 | 2 | 3 | 4;
  sections: ShoppingSection[];
  leftover: string;
}

export interface Dispensa {
  title: string;
  note: string;
  items: string[];
}

export interface RefListItem {
  t?: string;
  d?: string;
}

export interface RefBlock {
  type: "p" | "list" | "table" | "callout" | "chips";
  title?: string;
  // p
  d?: string;
  // callout
  t?: string;
  tag?: string;
  // list / chips
  items?: Array<RefListItem | string>;
  // table
  cols?: string[];
  rows?: string[][];
}

export interface ReferenceSection {
  id: string;
  title: string;
  kicker: string;
  theme: ThemeName;
  summary: string;
  blocks: RefBlock[];
}

export interface Filter {
  id: string;
  label: string;
  kw: string[];
}

export interface DayMeta {
  key: string;
  short: string;
  full: string;
}

export interface Plan {
  days: DayMeta[];
  weeks: Week[];
  shopping: WeekShopping[];
  dispensa: { base: Dispensa; fusion: Dispensa };
  reference: ReferenceSection[];
  filters: Filter[];
  equipment: string[];
  cuisines: string[];
}
