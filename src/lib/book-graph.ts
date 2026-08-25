import { BOOKS } from "@/data/books";
import { LISTENS } from "@/data/listens";
import { TEASERS } from "@/data/teasers";
import type { Book } from "@/data/types";

export type GraphEdge = {
  a: string;
  b: string;
  weight: number;
  reasons: string[];
};

const SERIES: { label: string; members: string[] }[] = [
  {
    label: "Trilogia Want",
    members: ["parola-magica", "super-senso", "quinta"],
  },
  {
    label: "Stai calmo",
    members: ["stai-calmo", "colloquio"],
  },
  {
    label: "Instant",
    members: ["instant-persuasion", "instant-emotions"],
  },
  {
    label: "HCE manifesto",
    members: ["hce-1", "hce-vendita"],
  },
  {
    label: "Workbook 2026",
    members: ["bada", "incantali"],
  },
  {
    label: "Serie Parole (audio)",
    members: [
      "listen-parole-giuste",
      "listen-parole-magiche",
      "listen-parole-ribelli",
    ],
  },
];

/** Ponti espliciti libro ↔ audio nativo (non audiolibri). */
const BRIDGES: { a: string; b: string; label: string; weight: number }[] = [
  { a: "listen-parole-magiche", b: "parola-magica", label: "Parola magica", weight: 5 },
  { a: "listen-parole-giuste", b: "stai-calmo", label: "Parole giuste", weight: 4 },
  { a: "listen-parole-giuste", b: "parola-magica", label: "Linguaggio", weight: 3 },
  { a: "listen-parole-ribelli", b: "listen-parole-magiche", label: "Serie Parole", weight: 4 },
  { a: "listen-hce-corso", b: "hce-1", label: "HCE", weight: 5 },
  { a: "listen-hce-corso", b: "hce-vendita", label: "HCE", weight: 4 },
  { a: "listen-soft-skills", b: "hce-vendita", label: "Negoziazione", weight: 4 },
  { a: "listen-soft-skills", b: "listen-parole-vendere", label: "Vendita in audio", weight: 4 },
  { a: "listen-parole-vendere", b: "hce-vendita", label: "Vendita", weight: 5 },
  { a: "listen-restiamo", b: "hce-1", label: "Interazioni", weight: 4 },
  { a: "listen-restiamo", b: "instant-persuasion", label: "Sistema attuale", weight: 4 },
  { a: "listen-restiamo", b: "instant-emotions", label: "Sistema attuale", weight: 3 },
  // Proposte Fabrizio / sciolti
  { a: "forse-felice", b: "nessuno", label: "Stato e permesso", weight: 5 },
  { a: "codice", b: "chimica", label: "Il segreto", weight: 5 },
  { a: "forse-felice", b: "colleziona", label: "Felicità / attimi", weight: 4 },
  { a: "brillare", b: "chiedi", label: "Domande", weight: 4 },
  { a: "colleziona", b: "da-adesso", label: "Tempo e svolta", weight: 4 },
  { a: "chiedi", b: "da-adesso", label: "Sguardo e conduzione", weight: 4 },
];

const METHOD_TAGS = ["E3", "DPI", "IBM", "SPARK", "DMN"] as const;

function pairKey(a: string, b: string) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function methodTags(id: string) {
  const keys = TEASERS[id]?.keys ?? [];
  return METHOD_TAGS.filter((tag) =>
    keys.some((k) => k === tag || k.includes(tag)),
  );
}

/**
 * Affinità: serie, sigle metodo, era, ponti audio.
 * Niente forma, editore, co-autori, ponte chimica manuale.
 */
export function buildBookGraph(books: Book[] = BOOKS): {
  books: Book[];
  edges: GraphEdge[];
} {
  const byId = new Map<string, Book | { id: string; era: string }>(
    books.map((b) => [b.id, b]),
  );
  for (const listen of LISTENS) {
    byId.set(listen.id, listen);
  }

  const edgeMap = new Map<string, GraphEdge>();

  function bump(a: string, b: string, weight: number, reason: string) {
    if (a === b || !byId.has(a) || !byId.has(b)) return;
    const key = pairKey(a, b);
    const existing = edgeMap.get(key);
    if (existing) {
      existing.weight += weight;
      if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
    } else {
      edgeMap.set(key, { a, b, weight, reasons: [reason] });
    }
  }

  for (const series of SERIES) {
    const members = series.members.filter((id) => byId.has(id));
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        bump(members[i], members[j], 5, series.label);
      }
    }
  }

  for (const bridge of BRIDGES) {
    bump(bridge.a, bridge.b, bridge.weight, bridge.label);
  }

  for (let i = 0; i < books.length; i++) {
    for (let j = i + 1; j < books.length; j++) {
      const A = books[i];
      const B = books[j];

      if (A.era === B.era) {
        bump(A.id, B.id, 1, "Stesso filo");
      }

      const tagsA = methodTags(A.id);
      const tagsB = methodTags(B.id);
      for (const tag of tagsA) {
        if (tagsB.includes(tag)) bump(A.id, B.id, 3, tag);
      }
    }
  }

  for (let i = 0; i < LISTENS.length; i++) {
    for (let j = i + 1; j < LISTENS.length; j++) {
      if (LISTENS[i].era === LISTENS[j].era) {
        bump(LISTENS[i].id, LISTENS[j].id, 1, "Stesso filo audio");
      }
    }
  }

  const edges = [...edgeMap.values()]
    .filter((e) => e.weight >= 4)
    .sort((a, b) => b.weight - a.weight);

  return { books, edges };
}

/** Snapshot per il brain hero (affinità >= 4). */
export const BOOK_GRAPH_EDGES: GraphEdge[] = buildBookGraph().edges;
