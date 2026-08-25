"use client";

import dynamic from "next/dynamic";

const BookBrainGraph = dynamic(
  () =>
    import("@/components/book-brain-graph").then((m) => m.BookBrainGraph),
  { ssr: false },
);

export function HeroBrain({
  onOpenBook,
  onOpenAudio,
}: {
  onOpenBook?: (id: string) => void;
  onOpenAudio?: (id: string) => void;
}) {
  return (
    <header className="hero">
      <div className="hero-copy">
        <h1 className="hero-brand">
          Pa<span className="hero-brand-r">(r)</span>oloteca
        </h1>
        <p className="hero-tagline">Una costellazione di parole.</p>
      </div>
      <div className="hero-graph">
        <BookBrainGraph onOpenBook={onOpenBook} onOpenAudio={onOpenAudio} />
      </div>
    </header>
  );
}
