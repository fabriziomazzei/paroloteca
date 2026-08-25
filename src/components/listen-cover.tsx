"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Listen } from "@/data/types";
import { listenKindLabel } from "@/lib/catalog";

type Size = "thumb" | "shelf" | "detail" | "related";

export function ListenCover({ listen, size }: { listen: Listen; size: Size }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [ok, setOk] = useState(false);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) setOk(true);
  }, [listen.id]);

  return (
    <div className={`cover cover-${size} listen-cover`} data-era={listen.era}>
      <div className="cover-shine" />
      {!ok ? (
        <div className="cover-fallback listen-cover-fallback">
          <span className="listen-cover-kind">{listenKindLabel(listen.kind)}</span>
          <span className="listen-cover-title">{listen.title}</span>
          <span className="listen-cover-year">{listen.year ?? "—"}</span>
        </div>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={`/covers/audio/${listen.id}.webp`}
        alt={`Copertina audio: ${listen.title}`}
        className={ok ? "is-on" : "is-off"}
        onLoad={() => setOk(true)}
        onError={() => setOk(false)}
      />
    </div>
  );
}
