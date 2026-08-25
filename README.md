# Paroloteca

Nome pubblico: **Paroloteca** (biblioteca + parole).  
Tagline: **Nel giusto ordine**.

Semilavorato Next.js per HCE. In pagina: niente Fabrizio, niente ClauDisk. Footer: *È tuo. Fanne quello che vuoi.*

## Perché Next

Il sito è HTML/CSS/React. Next è solo il telaio: `npm run dev` in locale, Vercel in produzione. Non serve un database né un server tuo. `create-next-app` è la base giusta per una repo GitHub privata da condividere con Mazzilli.

L'`index.html` iniziale era lo schizzo. Next **non lo legge**: la home è `src/app/page.tsx`. Per questo `npm run dev` mostrava il template vuoto di Next, non la libreria.

## Aprire

```
npm install
npm run dev
```

Poi http://localhost:3000

## Cosa c'è

| Percorso | Ruolo |
| --- | --- |
| `src/app/` | Shell Next (layout, pagina, CSS) |
| `src/data/` | Ere, forme, schede libri |
| `src/lib/catalog.ts` | Filtri |
| `src/components/` | Hero, toolbar, timeline, scaffale, copertina, cassetto |
| `public/covers/` | `{id}.jpg` se c'è; altrimenti dorso tipografico |

## Copertine

File ufficiali: `public/covers/{id}.jpg`. Script: `tools/fetch-covers.ps1`.

Prima chat in questa cartella: incolla `KICKOFF.md` (file locale, non va in repo).

## Deploy

Repo GitHub privata, poi Import su Vercel. Framework: Next.js, zero config extra.
