"use client";

import { Cover } from "@/components/cover";
import { ListenCover } from "@/components/listen-cover";
import {
  catalogKindLabel,
  formLabel,
  listenKindLabel,
} from "@/lib/catalog";
import type { CatalogItem, LayoutId, ScopeId } from "@/data/types";

export function ItemCard({
  item,
  view,
  scope,
  onOpenBook,
  onOpenAudio,
}: {
  item: CatalogItem;
  view: LayoutId;
  scope: ScopeId;
  onOpenBook?: (id: string) => void;
  onOpenAudio?: (id: string) => void;
}) {
  const compact = view === "shelf";
  const showYear = view !== "timeline";
  const showKind = scope === "tutto";

  if (item.kind === "book") {
    const { book } = item;
    const kicker = [
      showYear ? String(book.year) : null,
      formLabel(book.form),
    ]
      .filter(Boolean)
      .join(" · ");
    const desc = book.blurb || book.subtitle;

    return (
      <button
        type="button"
        className={`book-card ${compact ? "is-shelf" : ""}`}
        data-era={book.era}
        onClick={() => onOpenBook?.(book.id)}
      >
        <Cover book={book} size={compact ? "shelf" : "thumb"} />
        <div className="book-body">
          {kicker ? <p className="kicker">{kicker}</p> : null}
          <h3>{book.title}</h3>
          {desc ? <p className="sub">{desc}</p> : null}
          {showKind ? (
            <div className="meta-row">
              <span className="pill">{catalogKindLabel("book")}</span>
            </div>
          ) : null}
        </div>
      </button>
    );
  }

  const { listen } = item;
  const kicker = [
    showYear ? (listen.year ?? "n.d.") : null,
    listenKindLabel(listen.kind),
  ]
    .filter(Boolean)
    .join(" · ");
  const desc = listen.blurb || listen.subtitle;

  return (
    <button
      type="button"
      className={`book-card listen-card-inline ${compact ? "is-shelf" : ""}`}
      data-era={listen.era}
      onClick={() => onOpenAudio?.(listen.id)}
    >
      <ListenCover listen={listen} size={compact ? "shelf" : "thumb"} />
      <div className="book-body">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h3>{listen.title}</h3>
        {desc ? <p className="sub">{desc}</p> : null}
        {showKind || listen.needsInfo ? (
          <div className="meta-row">
            {showKind ? (
              <span className="pill">{catalogKindLabel("listen")}</span>
            ) : null}
            {listen.needsInfo ? (
              <span className="pill stub-pill">Da riempire</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </button>
  );
}
