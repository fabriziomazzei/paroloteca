import { BOOKS } from "@/data/books";
import { ERAS } from "@/data/eras";
import { FORMS } from "@/data/forms";
import { LISTENS } from "@/data/listens";
import { LISTEN_TEASERS } from "@/data/listen-teasers";
import { TEASERS } from "@/data/teasers";
import { relatedNeighbors } from "@/lib/book-graph";
import type {
  Book,
  BookTeaser,
  CatalogItem,
  EraId,
  FormId,
  Listen,
  ListenKind,
  ScopeId,
} from "@/data/types";

export function formLabel(id: FormId | "all") {
  return FORMS.find((form) => form.id === id)?.label ?? id;
}

export function eraLabel(id: EraId) {
  return ERAS.find((era) => era.id === id)?.label ?? id;
}

export function findBook(id: string | null): Book | undefined {
  if (!id) return undefined;
  return BOOKS.find((book) => book.id === id);
}

export function findListen(id: string | null): Listen | undefined {
  if (!id) return undefined;
  return LISTENS.find((item) => item.id === id);
}

export function teaserOf(id: string): BookTeaser | undefined {
  return TEASERS[id];
}

export function listenTeaserOf(id: string) {
  return LISTEN_TEASERS[id];
}

function matchEra(era: EraId | "all", itemEra: EraId) {
  return era === "all" || itemEra === era;
}

export function catalogItems(
  scope: ScopeId,
  era: EraId | "all",
): CatalogItem[] {
  const items: CatalogItem[] = [];

  if (scope === "libri" || scope === "tutto") {
    for (const book of BOOKS) {
      if (!matchEra(era, book.era)) continue;
      items.push({ kind: "book", book });
    }
  }

  if (scope === "audio" || scope === "tutto") {
    for (const listen of LISTENS) {
      if (!matchEra(era, listen.era)) continue;
      // Solo audio nativi (original / percorso / corso)
      if (listen.kind === "audiolibro") continue;
      items.push({ kind: "listen", listen });
    }
  }

  return items.sort((a, b) => {
    const ay = a.kind === "book" ? a.book.year : (a.listen.year ?? 9999);
    const by = b.kind === "book" ? b.book.year : (b.listen.year ?? 9999);
    if (ay !== by) return ay - by;
    const at = a.kind === "book" ? a.book.title : a.listen.title;
    const bt = b.kind === "book" ? b.book.title : b.listen.title;
    return at.localeCompare(bt, "it");
  });
}

export function itemsByYear(scope: ScopeId, era: EraId | "all") {
  const map = new Map<number, CatalogItem[]>();
  for (const item of catalogItems(scope, era)) {
    const year =
      item.kind === "book" ? item.book.year : (item.listen.year ?? 0);
    const key = year || 0;
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, items]) => ({ year, items }));
}

export function listenKindLabel(kind: ListenKind) {
  const map: Record<ListenKind, string> = {
    audiolibro: "Audiolibro",
    original: "Original",
    percorso: "Percorso",
    corso: "Corso",
  };
  return map[kind];
}

export function catalogKindLabel(kind: "book" | "listen") {
  return kind === "book" ? "Lettura" : "Ascolto";
}

export type RelatedPick = {
  item: CatalogItem;
  reason: string;
};

function pickReason(reasons: string[]) {
  return (
    reasons.find((reason) => !reason.startsWith("Stesso filo")) ??
    reasons[0] ??
    ""
  );
}

export function relatedItems(id: string, limit = 3): RelatedPick[] {
  const picks: RelatedPick[] = [];
  for (const neighbor of relatedNeighbors(id, limit + 3)) {
    if (picks.length >= limit) break;
    const book = findBook(neighbor.id);
    if (book) {
      picks.push({
        item: { kind: "book", book },
        reason: pickReason(neighbor.reasons),
      });
      continue;
    }
    const listen = findListen(neighbor.id);
    if (listen && listen.kind !== "audiolibro") {
      picks.push({
        item: { kind: "listen", listen },
        reason: pickReason(neighbor.reasons),
      });
    }
  }
  return picks;
}

const KEEP_CAPS = new Set([
  "HCE",
  "PNL",
  "IBM",
  "DPI",
  "DMN",
  "ALF",
  "BOC",
  "SPARK",
  "E3",
  "YA",
]);

/** Titoli indice: niente caps lock, maiuscola solo in apertura e dopo . ! ? : */
export function toSentenceCase(text: string): string {
  const softened = text.replace(/\p{L}[\p{L}\p{M}\d]*/gu, (word) => {
    if (KEEP_CAPS.has(word)) return word;
    const letters = [...word].filter((ch) => /\p{L}/u.test(ch));
    if (letters.length < 1) return word;
    const allCaps =
      word === word.toLocaleUpperCase("it") &&
      word !== word.toLocaleLowerCase("it");
    return allCaps ? word.toLocaleLowerCase("it") : word;
  });

  return softened.replace(
    /(^|[.!?…:]\s*)([^\p{L}]*)(\p{L})/gu,
    (_, prefix: string, extra: string, letter: string) =>
      prefix + extra + letter.toLocaleUpperCase("it"),
  );
}
