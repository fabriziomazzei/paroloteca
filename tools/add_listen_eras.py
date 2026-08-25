from pathlib import Path
import re

# Map related book id / year heuristics to era
BOOK_ERA = {
    "brillare": "radice",
    "stai-calmo": "radice",
    "colloquio": "radice",
    "parola-magica": "romanzi",
    "super-senso": "romanzi",
    "quinta": "romanzi",
    "codice": "misura",
    "hce-1": "misura",
    "hce-vendita": "misura",
    "basta-dirlo": "misura",
    "nessuno": "divulgazione",
    "forse-felice": "divulgazione",
    "colleziona": "divulgazione",
    "chimica": "divulgazione",
    "chiedi": "divulgazione",
    "da-adesso": "divulgazione",
    "instant-persuasion": "sistema",
    "usa-cervello": "sistema",
    "bada": "sistema",
    "instant-emotions": "sistema",
    "incantali": "sistema",
    "restiamo": "sistema",
}

path = Path(r"c:\Users\fabri\Desktop\Progetti\Paroloteca\src\data\listens.ts")
text = path.read_text(encoding="utf-8")

# Insert era before needsInfo in each object
def add_era(m):
    block = m.group(0)
    if "\n    era:" in block:
        return block
    rel = re.search(r'relatedBookId: "([^"]+)"', block)
    year_m = re.search(r"year: (\d+|null)", block)
    if rel and rel.group(1) in BOOK_ERA:
        era = BOOK_ERA[rel.group(1)]
    elif year_m and year_m.group(1) != "null":
        y = int(year_m.group(1))
        if y <= 2018:
            era = "radice"
        elif y <= 2020:
            era = "romanzi"
        elif y <= 2021:
            era = "misura"
        elif y <= 2024:
            era = "divulgazione"
        else:
            era = "sistema"
    else:
        # Originals / corsi senza anno: sistema o misura a seconda del titolo
        title = re.search(r'title: "([^"]+)"', block)
        t = (title.group(1) if title else "").lower()
        if "pnl" in t:
            era = "radice"
        elif any(x in t for x in ["parole magiche", "parole giuste", "parole ribelli", "soft", "hce -", "parole per"]):
            era = "misura"
        else:
            era = "sistema"
    return block.replace("\n    needsInfo:", f'\n    era: "{era}",\n    needsInfo:')

text2 = re.sub(
    r"\{\n    id: \"listen-[^\"]+\"[\s\S]*?\n  \},",
    add_era,
    text,
)
path.write_text(text2, encoding="utf-8")
print("eras added", text2.count("\n    era:"))
