import type { Listen } from "./types";

/**
 * Solo audio nativi (Original / percorsi / corsi).
 * Niente audiolibri di volumi già nello scaffale.
 */
export const LISTENS: Listen[] = [
  {
    id: "listen-restiamo",
    title: "Restiamo Intelligenti",
    subtitle: "La Scienza delle Interazioni Umane",
    year: 2026,
    kind: "original",
    duration: "5 h 57 min",
    narrator: "Paolo Borzacchiello",
    publisher: "Audible",
    blurb:
      "Audible Original audio-first (non esiste in carta). Otto episodi ~45 min.",
    era: "sistema",
    needsInfo: false,
  },
  {
    id: "listen-parole-giuste",
    title: "Le parole giuste",
    subtitle: "Guida in 10 ascolti all'intelligenza linguistica",
    year: 2019,
    kind: "percorso",
    duration: "10 lezioni · ~10 h",
    narrator: "Paolo Borzacchiello",
    publisher: "Audible Originals",
    blurb:
      "Scopri il potere del linguaggio ipnotico: Milton Model, sleight of mouth, metamodello, obiezioni, metaprogrammi, metafore, storytelling e persuasione. Scritto e narrato in esclusiva per Audible, con esercizi pratici.",
    era: "misura",
    needsInfo: false,
    audibleUrl: "https://www.audible.it/podcast/Le-parole-giuste/B09J1NW557",
  },
  {
    id: "listen-hce-corso",
    title: "HCE - Human Connections Engineering",
    subtitle: "Decode, profile, influence",
    year: 2019,
    kind: "corso",
    duration: "10 episodi · ~10 h",
    narrator: "Paolo Borzacchiello",
    publisher: "Audible Originals",
    blurb:
      "Come funziona davvero un'interazione umana: variabili, cinque intelligenze, profile ambientale e personale. Attraverso gli occhi del profiler Leonard Want: decode, profile, influence. Dieci episodi con tanta pratica.",
    era: "misura",
    needsInfo: false,
    audibleUrl:
      "https://www.audible.it/podcast/HCE-Human-Connections-Engineering/B09J1L2QVP",
  },
  {
    id: "listen-soft-skills",
    title: "Soft Skills Express - Negoziazione",
    subtitle: "12 lezioni sulla negoziazione",
    year: 2020,
    kind: "corso",
    duration: "12 episodi · ~4 h",
    narrator: "Paolo Borzacchiello",
    publisher: "Audible Originals",
    blurb:
      "Come funziona il cervello in negoziazione: presentazione, persuasione, obiezioni, frasi del potere, non verbale. Dodici lezioni pratiche nella serie Soft Skills Express di Audible.",
    era: "misura",
    needsInfo: false,
    audibleUrl:
      "https://www.audible.it/podcast/Soft-Skills-Express-Negoziazione/B09J1LWZ9F",
  },
  {
    id: "listen-parole-magiche",
    title: "Le parole magiche",
    subtitle: "L'effetto delle parole su di sé e sugli altri",
    year: 2021,
    kind: "original",
    duration: "12 episodi · ~5 h",
    narrator: "Paolo Borzacchiello",
    publisher: "Audible Originals",
    blurb:
      "Cosa dici davvero quando parli o scrivi: parole tossiche, proverbi, metafore, carisma, risposta perfetta. Dodici episodi per cambiare il linguaggio e cambiare la vita, privata e professionale.",
    era: "misura",
    needsInfo: false,
    audibleUrl: "https://www.audible.it/podcast/Le-parole-magiche/B09J1N4DGF",
  },
  {
    id: "listen-parole-ribelli",
    title: "Le parole ribelli",
    subtitle: "Ribaltare proverbi e modi di dire",
    year: 2022,
    kind: "percorso",
    duration: "12 episodi · ~5 h",
    narrator: "Paolo Borzacchiello",
    publisher: "Audible Studios",
    blurb:
      "Dopo Le parole giuste e Le parole magiche: parole comuni trasformate, proverbi ribaltati, personaggi difficili dal vivo e sui social. Dodici episodi sulla magia dell'Abracadabra.",
    era: "divulgazione",
    needsInfo: false,
    audibleUrl: "https://www.audible.it/podcast/Le-parole-ribelli/B0BR5XD576",
  },
  {
    id: "listen-parole-vendere",
    title: "Parole per vendere",
    subtitle: "Clip su PNL e parole magiche in vendita",
    year: 2020,
    kind: "corso",
    duration: "14 clip · ~30 min",
    narrator: "Paolo Borzacchiello",
    publisher: "Paolo Borzacchiello",
    blurb:
      "Serie breve (set-ott 2020): PNL, mappa e territorio, significato della comunicazione, 18 parole magiche (Sì, Nuovo, Sorpresa) e micro-lezioni su passione, regalo, scoperta, magico.",
    era: "misura",
    needsInfo: false,
  },
];

export const LISTEN_KINDS = [
  { id: "all" as const, label: "Tutti" },
  { id: "original" as const, label: "Original" },
  { id: "percorso" as const, label: "Percorsi" },
  { id: "corso" as const, label: "Corsi" },
];
