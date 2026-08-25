"use client";

import { useEffect, useId, useRef } from "react";
import { Cover } from "@/components/cover";
import { ListenCover } from "@/components/listen-cover";
import { formLabel, listenKindLabel, listenTeaserOf, teaserOf } from "@/lib/catalog";
import type { Book, Listen } from "@/data/types";

export function ItemModal({
  book,
  listen,
  onClose,
}: {
  book?: Book | null;
  listen?: Listen | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(book || listen);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-root" role="presentation">
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Chiudi"
        onClick={onClose}
      />
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeRef}
          type="button"
          className="modal-close"
          onClick={onClose}
        >
          Chiudi
        </button>

        {book ? <BookModalBody book={book} titleId={titleId} /> : null}
        {listen ? <ListenModalBody listen={listen} titleId={titleId} /> : null}
      </div>
    </div>
  );
}

function BookModalBody({ book, titleId }: { book: Book; titleId: string }) {
  const teaser = teaserOf(book.id);
  return (
    <article className="modal-detail" data-era={book.era}>
      <div className="modal-cover">
        <Cover book={book} size="detail" />
      </div>
      <div className="modal-body">
        <p className="kicker">
          {book.year} · {formLabel(book.form)}
          {book.publisher ? ` · ${book.publisher}` : ""}
        </p>
        <h2 id={titleId}>{book.title}</h2>
        {book.subtitle ? <p className="detail-sub">{book.subtitle}</p> : null}
        <p className="detail-blurb">{book.blurb}</p>

        <ul className="facts">
          <li>
            <span>Autori</span>
            {book.authors.join(", ")}
          </li>
          {teaser?.pages ? (
            <li>
              <span>Pagine</span>
              {teaser.pages}
            </li>
          ) : null}
          {book.isbn ? (
            <li>
              <span>ISBN</span>
              {book.isbn}
            </li>
          ) : null}
        </ul>

        {teaser?.chapters?.length ? (
          <div className="teaser-block">
            <h3>{book.id === "brillare" ? "I post (titoli)" : "Indice"}</h3>
            <ol className="teaser-list">
              {teaser.chapters.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        ) : null}

        {teaser?.keys?.length ? (
          <div className="teaser-block">
            <h3>Elementi chiave</h3>
            <ul className="teaser-list teaser-keys">
              {teaser.keys.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ListenModalBody({
  listen,
  titleId,
}: {
  listen: Listen;
  titleId: string;
}) {
  const teaser = listenTeaserOf(listen.id);
  return (
    <article className="modal-detail detail-audio" data-era={listen.era}>
      <div className="modal-cover">
        <ListenCover listen={listen} size="detail" />
      </div>
      <div className="modal-body">
        <p className="kicker">
          {listen.year ?? "n.d."} · {listenKindLabel(listen.kind)}
          {listen.publisher ? ` · ${listen.publisher}` : ""}
        </p>
        <h2 id={titleId}>{listen.title}</h2>
        {listen.subtitle ? <p className="detail-sub">{listen.subtitle}</p> : null}
        <p className="detail-blurb">{listen.blurb}</p>

        <ul className="facts">
          <li>
            <span>Durata</span>
            {listen.duration || "—"}
          </li>
          <li>
            <span>Voce</span>
            {listen.narrator || "—"}
          </li>
        </ul>

        {listen.audibleUrl ? (
          <p className="detail-outlink">
            <a href={listen.audibleUrl} target="_blank" rel="noreferrer">
              Ascolta su Audible →
            </a>
          </p>
        ) : null}

        {teaser?.episodes?.length ? (
          <div className="teaser-block">
            <h3>Episodi</h3>
            <ol className="teaser-list">
              {teaser.episodes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        ) : null}

        {teaser?.keys?.length ? (
          <div className="teaser-block">
            <h3>Elementi chiave</h3>
            <ul className="teaser-list teaser-keys">
              {teaser.keys.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {listen.needsInfo ? (
          <p className="teaser-note">
            Scheda da completare con i dettagli ufficiali.
          </p>
        ) : null}
      </div>
    </article>
  );
}
