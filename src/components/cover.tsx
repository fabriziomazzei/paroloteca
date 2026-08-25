"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Book } from "@/data/types";

type Size = "thumb" | "shelf" | "hero" | "detail";

export function Cover({ book, size }: { book: Book; size: Size }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [ok, setOk] = useState(false);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setOk(true);
    }
  }, [book.id]);

  return (
    <div className={`cover cover-${size}`} data-era={book.era}>
      <div className="cover-shine" />
      {!ok ? (
        <div className="cover-fallback">
          <span className="spine">{book.year}</span>
          <span className="ctitle">{book.title}</span>
        </div>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={`/covers/${book.id}.webp`}
        alt={`Copertina: ${book.title}`}
        className={ok ? "is-on" : "is-off"}
        onLoad={() => setOk(true)}
        onError={() => setOk(false)}
      />
    </div>
  );
}
