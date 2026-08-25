import { ItemCard } from "@/components/item-card";
import type { CatalogItem, ScopeId } from "@/data/types";

export function VerticalTimeline({
  blocks,
  scope,
  onOpenBook,
  onOpenAudio,
}: {
  blocks: { year: number; items: CatalogItem[] }[];
  scope: ScopeId;
  onOpenBook?: (id: string) => void;
  onOpenAudio?: (id: string) => void;
}) {
  if (!blocks.length) {
    return <p className="empty">Niente con questi filtri.</p>;
  }

  return (
    <div className="timeline">
      {blocks.map((block, index) => (
        <section
          key={block.year || "nd"}
          className="year-block"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="year-head">
            <h2>{block.year || "Anno da completare"}</h2>
          </div>
          <div className="year-books">
            {block.items.map((item) => (
              <ItemCard
                key={item.kind === "book" ? item.book.id : item.listen.id}
                item={item}
                view="timeline"
                scope={scope}
                onOpenBook={onOpenBook}
                onOpenAudio={onOpenAudio}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
