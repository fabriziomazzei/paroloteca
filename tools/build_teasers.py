"""Build teaser chapters + technique names for each book. Does not copy PDF text bodies."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCAN = Path(__file__).with_name("pdf-scan.json")
KNOW = Path(r"C:\Users\fabri\Desktop\Claude Brain\HCE\knowledge")
OUT_TS = ROOT / "src" / "data" / "teasers.ts"

SKIP = {
    "copertina",
    "frontespizio",
    "copyright",
    "sommario",
    "indice",
    "indice dei contenuti",
    "ringraziamenti",
    "l'autore",
    "l’autore",
    "il libro",
    "dedica",
    "index",
    "disclaimer",
    "wide edizioni",
    "bibliografia essenziale",
    "risorse",
    "come continuare la tua formazione",
}

KNOW_MAP = {
    "brillare": "BRILLARE_COME_UNA_STELLA__Paolo_Borzacchiello_.md",
    "stai-calmo": "Stai_calmo_e_usa_le_parole_giuste_nel_giusto_ordine__Italian_Edition___Paolo_Borzacchiello.md",
    "parola-magica": "La_parola_magica_Il_primo_libro_che_ti_cambia_mentre_lo_leggi_con_il_potere_dellintelligenza_linguistica__Italian_Edition___Paolo_Borzacchiello_.md",
    "super-senso": "Il_Super_Senso_--_Borzacchiello_Paolo.md",
    "codice": "Il_codice_segreto_del_linguaggio_Come_affinare_lintelligenza_linguistica_e_costruire_la_comunicazione_perfetta_in_10_passi__Paolo_Borzacchiello_.md",
    "quinta": "La_quinta_essenza__Paolo_Borzacchiello_.md",
    "hce-1": "HCE_La_scienza_delle_interazioni_umane__Italian_Edition___Paolo_Borzacchiello__Luca_Mazzilli_.md",
    "hce-vendita": "HCE_La_scienza_delle_interazioni_umane__La_vendita_e_lingaggio_del_cliente__Italian_Edition___Paolo_Borzacchiello__Luca_Mazzilli_.md",
    "basta-dirlo": "Basta_dirlo__Paolo_Borzacchiello_.md",
    "nessuno": "Nessuno_può_farti_star_male_senza_il_tuo_permesso__Paolo_Borzacchiello_etc__.md",
    "forse-felice": "Forse_sei_già_felice_e_non_lo_sai__Paolo_Borzacchiello_.md",
    "colleziona": "Colleziona_attimi_di_altissimo_splendore__Unalternativa_alla_felicità__Paolo_Borzacchiello.md",
    "chimica": "La_chimica_segreta_delle_interazioni_umane__Riconoscere_e_utilizzare_ormoni__neurotrasmettitori_e_mix_biochimici_per_relazioni___Paolo_Borzacchiello_.md",
    "chiedi": "Chiedi_bene_e_ti_sarà_dato__Paolo_Borzacchiello_.md",
    "da-adesso": "Da_adesso_in_poi__Paolo_Borzacchiello.md",
    "instant-persuasion": "Instant_Persuasion__Paolo_Borzacchiello_.md",
    "usa-cervello": "Usa_il_cervello_prima_che_lui_usi_te__Paolo_Borzacchiello_.md",
    "instant-emotions": "Instant_Emotions__I_segreti_delle_neuroscienze_applicati_alle_emozioni__Paolo_Borzacchiello__.md",
    "incantali": "Incantali_tutti__Paolo_Borzacchiello_.md",
}

SIGLE_PAT = re.compile(
    r"\b(DPI|E3|IBM|SPARK|HCE|DMN|KEEP|DROP)\b", re.I
)


def clean_title(t: str) -> str:
    t = re.sub(r"\s+", " ", t).strip(" .")
    t = t.replace("�", "'")
    return t


def is_skip(t: str) -> bool:
    low = t.lower().strip()
    if low in SKIP:
        return True
    if low.startswith("appendice"):
        return True
    if "copyright" in low:
        return True
    return False


def chapters_from_scan(info: dict) -> list[str]:
    toc = info.get("toc") or []
    depth0 = [clean_title(x["title"]) for x in toc if isinstance(x, dict) and x.get("depth") == 0]
    depth0 = [t for t in depth0 if t and not is_skip(t)]
    if len(depth0) >= 4:
        # drop book title if first item equals title-ish short
        return depth0[:14]
    any_depth = [clean_title(x["title"]) for x in toc if isinstance(x, dict) and "title" in x]
    any_depth = [t for t in any_depth if t and not is_skip(t)]
    if len(any_depth) >= 4:
        return any_depth[:14]
    samples = [clean_title(x) for x in info.get("sample_heads") or []]
    samples = [t for t in samples if t and not is_skip(t) and len(t) > 6]
    return samples[:12]


def techniques_from_knowledge(bid: str) -> tuple[list[str], list[str]]:
    fname = KNOW_MAP.get(bid)
    if not fname:
        return [], []
    path = KNOW / fname
    if not path.exists():
        # fuzzy
        for p in KNOW.glob("*.md"):
            if bid.split("-")[0] in p.name.lower():
                path = p
                break
    if not path.exists():
        return [], []
    text = path.read_text(encoding="utf-8", errors="replace")
    # prefer ### under ## Tecniche section
    tech_section = ""
    m = re.search(r"^##\s+Tecniche\s*$", text, re.M)
    if m:
        rest = text[m.end() :]
        nxt = re.search(r"^##\s+", rest, re.M)
        tech_section = rest[: nxt.start()] if nxt else rest
    else:
        tech_section = text

    names = []
    for line in tech_section.splitlines():
        if line.startswith("### "):
            name = line[4:].strip()
            if name.lower().startswith("catalogo"):
                continue
            if len(name) > 70:
                continue
            names.append(name)
        if len(names) >= 12:
            break

    sigle = sorted({m.group(1).upper() for m in SIGLE_PAT.finditer(text)})
    # drop KEEP/DROP from public sigle chips if we only want method acronyms
    sigle = [s for s in sigle if s not in {"KEEP", "DROP", "HCE"}]
    return names[:10], sigle


def main():
    scan = json.loads(SCAN.read_text(encoding="utf-8"))
    books = {}
    for bid, info in scan.items():
        ch = chapters_from_scan(info)
        keys, sigle = techniques_from_knowledge(bid)
        books[bid] = {
            "pages": info.get("pages"),
            "chapters": ch,
            "keys": keys,
            "sigle": sigle,
        }

    # Manual teasers for titles without PDF in folder
    books["bada"] = {
        "pages": None,
        "chapters": [
            "Osserva",
            "Comprendi",
            "Fai",
            "Ricorda",
            "Idee chiave",
        ],
        "keys": [
            "Ventuno lezioni di intelligenza linguistica",
            "Esercizi di osservazione e riscrittura",
            "Idee chiave a fine lezione",
        ],
        "sigle": [],
    }
    books["restiamo"] = {
        "pages": None,
        "chapters": [
            "Cervello e interazioni",
            "Parole e chimica",
            "Trappole cognitive",
            "Apparenza e percezione",
            "Restare intelligenti con la macchina",
        ],
        "keys": [
            "Original Audible sulla scienza delle interazioni",
            "Capitoli autonomi, ascolto nell'ordine che preferisci",
            "Dati e strategie, niente poster motivazionali",
        ],
        "sigle": [],
    }
    books["colloquio"] = {
        "pages": None,
        "chapters": [
            "Prima del colloquio",
            "Le parole giuste in sede",
            "Dopo: cosa fare delle risposte",
        ],
        "keys": [
            "Igiene lessicale applicata al colloquio",
            "Ordine delle risposte sotto pressione",
        ],
        "sigle": [],
    }

    # codice: outline was broken; use knowledge technique names heavily + generic chapter tease
    if books.get("codice") and len(books["codice"]["chapters"]) < 3:
        books["codice"]["chapters"] = [
            "Dieci indici per misurare il testo",
            "Ordine del discorso",
            "Call to action",
            "Scrittura che si può allenare",
        ]

    lines = [
        "/** Auto-generato da tools/build_teasers.py. Teasing: titoli capitolo / nomi tecnica, senza corpo. */",
        "export type BookTeaser = {",
        "  pages: number | null;",
        "  chapters: string[];",
        "  keys: string[];",
        "  sigle: string[];",
        "};",
        "",
        "export const TEASERS: Record<string, BookTeaser> = {",
    ]
    for bid, data in sorted(books.items()):
        lines.append(f"  {json.dumps(bid)}: {{")
        pages = "null" if data["pages"] is None else str(data["pages"])
        lines.append(f"    pages: {pages},")
        lines.append("    chapters: [")
        for c in data["chapters"]:
            lines.append(f"      {json.dumps(c, ensure_ascii=False)},")
        lines.append("    ],")
        lines.append("    keys: [")
        for k in data["keys"]:
            lines.append(f"      {json.dumps(k, ensure_ascii=False)},")
        lines.append("    ],")
        lines.append("    sigle: [")
        for s in data["sigle"]:
            lines.append(f"      {json.dumps(s, ensure_ascii=False)},")
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    OUT_TS.write_text("\n".join(lines), encoding="utf-8")
    print("wrote", OUT_TS, "books=", len(books))


if __name__ == "__main__":
    main()
