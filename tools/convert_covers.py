from pathlib import Path
from PIL import Image

covers = Path(__file__).resolve().parents[1] / "public" / "covers"

# book id -> unique substring(s) that identify the source file
RULES: list[tuple[str, tuple[str, ...]]] = [
    ("brillare", ("brillare",)),
    ("stai-calmo", ("usa le parole",)),
    ("parola-magica", ("parola magica",)),
    ("super-senso", ("super senso",)),
    ("codice", ("71x2", "codice")),
    ("quinta", ("quinta",)),
    ("hce-vendita", ("vendita",)),
    ("hce-1", ("scienza delle interazioni",)),
    ("basta-dirlo", ("basta dirlo", "basta")),
    ("nessuno", ("nessuno",)),
    ("forse-felice", ("forse",)),
    ("colleziona", ("colleziona",)),
    ("chimica", ("chimica",)),
    ("chiedi", ("chiedi",)),
    ("da-adesso", ("adesso",)),
    ("instant-persuasion", ("persuasion",)),
    ("usa-cervello", ("cevello", "cervello")),
    ("bada", ("bada",)),
    ("instant-emotions", ("emotions",)),
    ("incantali", ("incantali",)),
    ("restiamo", ("restiamo",)),
    ("colloquio", ("colloquio",)),
]


def norm(s: str) -> str:
    return s.lower().encode("ascii", "ignore").decode()


files = [p for p in covers.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}]

converted = []
missing = []
for book_id, needles in RULES:
    src = None
    for p in files:
        # skip already-converted id files when matching sources
        if p.stem == book_id:
            continue
        n = norm(p.name)
        if any(norm(needle) in n for needle in needles):
            # avoid hce-1 matching vendita
            if book_id == "hce-1" and "vendita" in n:
                continue
            if book_id == "stai-calmo" and "colloquio" in n:
                continue
            if book_id == "basta-dirlo" and "bada" in n:
                continue
            src = p
            break
    if src is None:
        missing.append(book_id)
        print("MISSING", book_id)
        continue

    dest = covers / f"{book_id}.webp"
    img = Image.open(src).convert("RGB")
    w, h = img.size
    if w > 900:
        img = img.resize((900, int(h * 900 / w)), Image.Resampling.LANCZOS)
    img.save(dest, "WEBP", quality=82, method=6)
    converted.append(book_id)
    print(f"OK {book_id} <- {src.name}")

print(f"done converted={len(converted)} missing={missing}")
