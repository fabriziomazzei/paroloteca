# Pa(r)oloteca

**Una costellazione di parole.**

Sito Next.js: libri e ascolti di [Paolo Borzacchiello](https://www.paoloborzacchiello.com/), collegati in un grafo interattivo. UI ispirata all’ecosistema HCE.

Live (noindex): [paroloteca.vercel.app](https://paroloteca.vercel.app/)

---

## Cosa fa

- **Hero a costellazione** – nodi con copertine, force-graph, particelle sulle linee, alone per filo di lettura
- **Schede in modale** – libri e audio con indici / episodi / elementi chiave (`?libro=` / `?audio=`)
- **Cronologia e scaffale** – filtri Volumi / Audio / Tutto e percorso “Secondo Fabrizio”
- **Audio nativi** – Original e percorsi Audible (niente audiolibri doppioni dei volumi)

---

## Stack

| Layer | Scelta |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, CSS (token HCE: charcoal + `#FADB14`) |
| Grafo | `react-force-graph-2d` + `d3-force` |
| Deploy | Vercel |

---

## Avvio

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # produzione
npm run start
```

---

## Struttura

```
src/
  app/           # layout, home, robots, redirect /libro /audio
  components/    # hero/grafo, catalogo, modale, toolbar, timeline
  data/          # books, listens, teasers, ere, grafo
  lib/           # catalog, affinità del grafo
public/
  covers/        # {id}.webp libri
  covers/audio/  # listen-*.webp
```

---

## Dati

- **Libri** → `src/data/books.ts` + `teasers.ts`, copertina `public/covers/{id}.webp`
- **Audio** → `src/data/listens.ts` + `listen-teasers.ts`, copertina `public/covers/audio/{id}.webp`
- **Collegamenti grafo** → `src/lib/book-graph.ts` (serie, ponti, sigle; soglia peso ≥ 4)

---

## SEO

Il deploy pubblico è **non indicizzabile**: `robots: noindex` nel layout e `src/app/robots.ts` con `Disallow: /`.

---

## Licenza / uso

Codice open su questo repo. I contenuti (titoli, copertine, testi) restano di competenza dei rispettivi titolari; il progetto è uno strumento di esplorazione, non un negozio né un archivio ufficiale.
