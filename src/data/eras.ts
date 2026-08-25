import type { Era } from "./types";

/**
 * Percorso di lettura personale (Fabrizio), non periodizzazione HCE.
 * In UI: "Un modo di leggere", design distinto dai filtri forma.
 */
export const ERAS: Era[] = [
  {
    id: "radice",
    label: "Le radici",
    years: "2012-2018",
    hint: "Diario e igiene lessicale. Dove inizia il filo, per me.",
  },
  {
    id: "romanzi",
    label: "Want e la scena",
    years: "2018-2020",
    hint: "La trilogia: la tecnica mentre la leggi, non mentre la studi.",
  },
  {
    id: "misura",
    label: "Quando diventa metodo",
    years: "2019-2021",
    hint: "Misura, disdetta, nasce HCE. Il dopo inizia a spiegare il prima.",
  },
  {
    id: "divulgazione",
    label: "Vita, senza troppe sigle",
    years: "2021-2024",
    hint: "Stesso kit, verso il pubblico ampio: saggi, lettere, conduzione.",
  },
  {
    id: "sistema",
    label: "Da qui, oggi",
    years: "2025-2026",
    hint: "Se sei nuovo: Instant, workbook, autodifesa, Audible.",
  },
];
