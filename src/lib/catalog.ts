import { BOOKS } from "@/data/books";
import { ERAS } from "@/data/eras";
import { FORMS } from "@/data/forms";
import { LISTENS } from "@/data/listens";
import { LISTEN_TEASERS } from "@/data/listen-teasers";
import { TEASERS } from "@/data/teasers";
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
