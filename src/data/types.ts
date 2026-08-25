export type EraId =
  | "radice"
  | "romanzi"
  | "misura"
  | "divulgazione"
  | "sistema";

export type FormId =
  | "romanzo"
  | "manuale"
  | "saggio"
  | "workbook"
  | "audio"
  | "diario"
  | "ebook";

export type ScopeId = "libri" | "audio" | "tutto";
export type LayoutId = "timeline" | "shelf";

export type ListenKind = "audiolibro" | "original" | "percorso" | "corso";

export type Book = {
  id: string;
  title: string;
  subtitle: string;
  /** Anno di prima edizione (formato più antico noto). */
  year: number;
  form: FormId;
  publisher: string;
  authors: string[];
  /** Percorso Secondo Fabrizio. Non ufficiale. */
  era: EraId;
  isbn: string;
  query: string;
  blurb: string;
};

export type BookTeaser = {
  pages: number | null;
  chapters: string[];
  keys: string[];
};

export type ListenTeaser = {
  episodes: string[];
  keys: string[];
};

export type Listen = {
  id: string;
  title: string;
  subtitle: string;
  year: number | null;
  kind: ListenKind;
  duration: string;
  narrator: string;
  publisher: string;
  blurb: string;
  relatedBookId?: string;
  era: EraId;
  needsInfo: boolean;
  /** Link Audible ufficiale, se noto. */
  audibleUrl?: string;
};

export type CatalogItem =
  | { kind: "book"; book: Book }
  | { kind: "listen"; listen: Listen };

export type Era = {
  id: EraId;
  label: string;
  years: string;
  hint: string;
};

export type Form = {
  id: FormId | "all";
  label: string;
};
