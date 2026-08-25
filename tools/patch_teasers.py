from pathlib import Path
import re

# Patch teasers.ts: brillare posts, bada index, restiamo no chapters

path = Path(r"c:\Users\fabri\Desktop\Progetti\Paroloteca\src\data\teasers.ts")
text = path.read_text(encoding="utf-8")

brillare_chapters = [
    "BRILLARE COME UNA STELLA",
    "ALCUNE PERSONE NON VOGLIONO ESSERE SALVATE",
    "SEI ALL'ALTEZZA DEI TUOI SOGNI?",
    "FIORI DI CILIEGIO",
    "A PROPOSITO DI AMY…",
    "UNA VITA COSÌ?",
    "GENERE, CHE COS'ALTRO POTEVO FARE?",
    "HAI SOLO QUESTA OCCASIONE",
    "COME PUOI PRETENDERE CHE GLI ALTRI TI DIANO VALORE…",
    "LA VITA NON È COME DOVREBBE ESSERE",
    "SEI UNA FOGLIA SECCA O UNA STELLA FISSA?",
    "LA FELICITÀ NON ARRIVA DAL CIELO",
    "LA MONTAGNA DI MAOMETTO",
    "I FILI CHE NON SI VEDONO",
    "IL CORAGGIO DEI PROPRI SOGNI",
    "CIÒ PER CUI SIAMO FATTI",
    "IL GRUPPO DEI PARI",
    "CHE COSA TI FA DAVVERO BRILLARE GLI OCCHI?",
    "PER IL TUO BENE. MAH.",
    "PER ASPERA AD ASTRA",
    "NOI PIÙ STRAORDINARI DELL'UNIVERSO!",
    "UFFICIO RECLAMI CHIUSO",
    "LA PIÙ GRANDE SFIDA",
    "MONDO DI MERDA",
    "LE CATENE CHE CI HANNO MESSO ADDOSSO",
    "QUELLI CHE DANNO FIATO ALLA BOCCA",
    "FACILE, VELOCE E SENZA FATICA!",
    "FALLO SUBITO, TI CONVIENE!",
    "L'ELEFANTE E LA GUIDA",
    "OBIETTIVO: PERCHÉ LO VOGLIO?",
    "PERCHÉ?",
    "STUDIA!",
    "DIPENDE SOLO DA TE!",
    "GUARDARSI DENTRO RENDE CIECHI",
    "ISTRUZIONI PER RENDERSI INFELICI",
    "LUNEDÌ",
    "LA VIA PIÙ SEMPLICE È QUELLA PIÙ SEMPLICE",
    "GARBAGE IN, GARBAGE OUT",
    "TRATTARSI BENE",
    "L'ATTITUDINE NON LA VENDONO AL MERCATO",
    "TI STAI ROVINANDO LA VITA DA SOLO?",
    "COME CI ROVINIAMO LA VITA DA SOLI (SEGUE…)",
    "PUOI FARE QUELLO CHE VUOI",
]

bada_chapters = [
    "PARTE PRIMA · Engage",
    "Iniziare un buon dialogo",
    "Fare una buona prima impressione",
    "Mostrare comprensione",
    "Connettersi all'istante con chiunque",
    "Il linguaggio generativo",
    "Attirare l'attenzione",
    "Rompere il ghiaccio",
    "PARTE SECONDA · Explain",
    "Le cornici di utilità",
    "Il viaggio dell'eroe",
    "Raccontare storie efficaci",
    "Costruire l'alchimia perfetta",
    "Creare empatia",
    "Incantare il mondo con le nostre storie",
    "Ridefinire uno stato d'animo",
    "PARTE TERZA · Exchange",
    "Cambiare prospettiva",
    "Le parole della leadership",
    "Predire il futuro",
    "Riconoscere le buone intenzioni",
    "Effetti positivi o negativi",
    "Gestire le obiezioni",
    "Superare gli ostacoli",
]


def fmt_list(items: list[str], indent: str = "      ") -> str:
    return "\n".join(f'{indent}{json_dumps(i)},' for i in items)


def json_dumps(s: str) -> str:
    import json

    return json.dumps(s, ensure_ascii=False)


def replace_block(book_id: str, pages: str, chapters: list[str], keys: list[str], sigle: list[str]) -> None:
    global text
    pattern = rf'  "{book_id}": \{{.*?\n  \}},'
    repl = (
        f'  "{book_id}": {{\n'
        f"    pages: {pages},\n"
        f"    chapters: [\n"
        f"{fmt_list(chapters)}\n"
        f"    ],\n"
        f"    keys: [\n"
        f"{fmt_list(keys)}\n"
        f"    ],\n"
        f"    sigle: [\n"
        f"{fmt_list(sigle)}\n"
        f"    ],\n"
        f"  }},"
    )
    new_text, n = re.subn(pattern, repl, text, count=1, flags=re.S)
    if n != 1:
        raise SystemExit(f"replace failed for {book_id}: {n}")
    text = new_text


replace_block(
    "brillare",
    "123",
    brillare_chapters,
    [
        "Come/cosa contro perché",
        "Stato e rappresentazioni interne",
        "SAR e distorsioni",
        "Reciprocità e lessico grezzo",
    ],
    [],
)

replace_block(
    "bada",
    "null",
    bada_chapters,
    [
        "Engage · Explain · Exchange",
        "Ventuno lezioni di intelligenza linguistica",
        "Workbook: osserva, comprendi, fai, ricorda",
    ],
    ["E3"],
)

replace_block(
    "restiamo",
    "null",
    [],
    [
        "Original Audible (niente indice di volume)",
        "Capitoli autonomi, ascolto nell'ordine che preferisci",
        "Cervello, parole, trappole cognitive, apparenza",
    ],
    [],
)

path.write_text(text, encoding="utf-8")
print("patched teasers.ts")
