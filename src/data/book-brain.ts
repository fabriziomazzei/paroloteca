import { BOOKS } from "@/data/books";
import { LISTENS } from "@/data/listens";
import type { EraId } from "@/data/types";
import { BOOK_GRAPH_EDGES } from "@/lib/book-graph";

export type BrainNode = {
  id: string;
  label: string;
  year?: number;
  cover?: string;
  val: number;
  kind: "hub" | "book" | "listen";
  /** Colore alone / raggruppamento (Secondo Fabrizio). */
  glow?: string;
  era?: EraId;
};

export type BrainLink = {
  source: string;
  target: string;
};

/** Allineati a globals.css [data-era] - un colore per filo. */
export const ERA_GLOW: Record<EraId, string> = {
  radice: "#9e9e9e",
  romanzi: "#339af0",
  misura: "#1aa3a3",
  divulgazione: "#ff922b",
  sistema: "#7c4dff",
};

export function buildBookBrainGraph(): {
  nodes: BrainNode[];
  links: BrainLink[];
} {
  const nodes: BrainNode[] = [
    {
      id: "paolo",
      label: "Paolo Borzacchiello",
      val: 40,
      kind: "hub",
      glow: "#fadb14",
    },
    ...BOOKS.map((book) => ({
      id: book.id,
      label: book.title,
      year: book.year,
      cover: `/covers/${book.id}.webp`,
      val: 18,
      kind: "book" as const,
      era: book.era,
      glow: ERA_GLOW[book.era],
    })),
    ...LISTENS.map((listen) => ({
      id: listen.id,
      label: listen.title,
      year: listen.year ?? undefined,
      cover: `/covers/audio/${listen.id}.webp`,
      val: 16,
      kind: "listen" as const,
      era: listen.era,
      glow: ERA_GLOW[listen.era],
    })),
  ];

  const ids = new Set(nodes.map((n) => n.id));
  const links: BrainLink[] = [
    ...BOOKS.map((book) => ({ source: "paolo", target: book.id })),
    ...LISTENS.map((listen) => ({ source: "paolo", target: listen.id })),
    ...BOOK_GRAPH_EDGES.filter((e) => ids.has(e.a) && ids.has(e.b)).map(
      (e) => ({ source: e.a, target: e.b }),
    ),
  ];

  return { nodes, links };
}
