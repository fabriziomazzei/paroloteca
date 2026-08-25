"use client";

import { Cover } from "@/components/cover";
import { ListenCover } from "@/components/listen-cover";
import { formLabel, listenKindLabel } from "@/lib/catalog";
import type { CatalogItem, LayoutId } from "@/data/types";

export function ItemCard({
  item,
  view,
  onOpenBook,
  onOpenAudio,
}: {
  item: CatalogItem;
  view: LayoutId;
  onOpenBook?: (id: string) => void;
  onOpenAudio?: (id: string) => void;
}) {
  const compact = view === "shelf";

  if (item.kind === "book") {
    const { book } = item;
    return (
      <button
        type="button"
        className={`book-card ${compact ? "is-shelf" : ""}`}
        data-era={book.era}
        onClick={() => onOpenBook?.(book.id)}
      >
        <Cover book={book} size={compact ? "shelf" : "thumb"} />
        <div className="book-body">
          <p className="kicker">
            {book.year} · {formLabel(book.form)}
          </p>
          <h3>{book.title}</h3>
          {book.subtitle && !compact ? <p className="sub">{book.subtitle}</p> : null}
          <div className="meta-row">
            {book.publisher ? <span className="pill">{book.publisher}</span> : null}
          </div>
        </div>
      </button>
    );
  }

  const { listen } = item;
  return (
    <button
      type="button"
      className={`book-card listen-card-inline ${compact ? "is-shelf" : ""}`}
      data-era={listen.era}
      onClick={() => onOpenAudio?.(listen.id)}
    >
      <ListenCover listen={listen} size={compact ? "shelf" : "thumb"} />
      <div className="book-body">
        <p className="kicker">
          {listen.year ?? "n.d."} · {listenKindLabel(listen.kind)}
        </p>
        <h3>{listen.title}</h3>
        {listen.subtitle && !compact ? <p className="sub">{listen.subtitle}</p> : null}
        <div className="meta-row">
          <span className="pill">Audio</span>
          {listen.needsInfo ? <span className="pill stub-pill">Da riempire</span> : null}
        </div>
      </div>
    </button>
  );
}
