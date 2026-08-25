"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HeroBrain } from "@/components/hero";
import { ItemCard } from "@/components/item-card";
import { ItemModal } from "@/components/item-modal";
import { Toolbar } from "@/components/toolbar";
import { VerticalTimeline } from "@/components/vertical-timeline";
import { catalogItems, findBook, findListen, itemsByYear } from "@/lib/catalog";
import type { EraId, LayoutId, ScopeId } from "@/data/types";

export function Catalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scope, setScope] = useState<ScopeId>("libri");
  const [layout, setLayout] = useState<LayoutId>("timeline");
  const [era, setEra] = useState<EraId | "all">("all");

  const yearBlocks = useMemo(() => itemsByYear(scope, era), [scope, era]);
  const shelfItems = useMemo(() => catalogItems(scope, era), [scope, era]);

  const bookId = searchParams.get("libro");
  const audioId = searchParams.get("audio");
  const openBook = findBook(bookId);
  const openListen = findListen(audioId);

  const setQuery = useCallback(
    (key: "libro" | "audio" | null, id?: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("libro");
      next.delete("audio");
      if (key && id) next.set(key, id);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const openBookModal = useCallback(
    (id: string) => setQuery("libro", id),
    [setQuery],
  );
  const openAudioModal = useCallback(
    (id: string) => setQuery("audio", id),
    [setQuery],
  );
  const closeModal = useCallback(() => setQuery(null), [setQuery]);

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <main className="shell">
        <HeroBrain onOpenBook={openBookModal} onOpenAudio={openAudioModal} />
        <Toolbar
          scope={scope}
          layout={layout}
          era={era}
          onScope={setScope}
          onLayout={setLayout}
          onEra={setEra}
        />

        {layout === "timeline" ? (
          <VerticalTimeline
            blocks={yearBlocks}
            onOpenBook={openBookModal}
            onOpenAudio={openAudioModal}
          />
        ) : shelfItems.length ? (
          <div className="shelf">
            {shelfItems.map((item, index) => (
              <div
                key={itemKey(item)}
                className="shelf-item"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <ItemCard
                  item={item}
                  view="shelf"
                  onOpenBook={openBookModal}
                  onOpenAudio={openAudioModal}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">Niente con questi filtri.</p>
        )}
      </main>

      <ItemModal
        book={openBook}
        listen={openListen}
        onClose={closeModal}
      />

      <footer className="site-footer">
        <p className="footer-gift">
          Un dono di <strong>Fabrizio Mazzei</strong> a{" "}
          <strong>Paolo Borzacchiello</strong>
        </p>
        <p className="footer-line">
          È tuo. Fanne quello che vuoi.
          <span className="footer-sep">·</span>
          <a
            className="footer-link"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            Codice su GitHub
          </a>
          <span className="footer-soon"> (link in arrivo)</span>
        </p>
      </footer>
    </>
  );
}

function itemKey(item: {
  kind: string;
  book?: { id: string };
  listen?: { id: string };
}) {
  return item.kind === "book" ? item.book!.id : item.listen!.id;
}
