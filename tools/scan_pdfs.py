from pathlib import Path
from pypdf import PdfReader
import re, json

pdf_dir = Path(r"C:\Users\fabri\Documents\Libri\Borzacchiello")
out = {}

def guess_id(name: str) -> str:
    n = name.lower()
    mapping = [
        ("brillare", "brillare"),
        ("stai calmo e usa", "stai-calmo"),
        ("parola magica", "parola-magica"),
        ("super senso", "super-senso"),
        ("codice segreto", "codice"),
        ("quinta essenza", "quinta"),
        ("vendita", "hce-vendita"),
        ("hce la scienza", "hce-1"),
        ("basta dirlo", "basta-dirlo"),
        ("nessuno", "nessuno"),
        ("forse sei", "forse-felice"),
        ("colleziona", "colleziona"),
        ("chimica", "chimica"),
        ("chiedi bene", "chiedi"),
        ("da adesso", "da-adesso"),
        ("instant persuasion", "instant-persuasion"),
        ("instant emotions", "instant-emotions"),
        ("usa il cervello", "usa-cervello"),
        ("incantali", "incantali"),
        ("bada", "bada"),
    ]
    for needle, bid in mapping:
        if needle in n:
            return bid
    return "unknown"


def walk(items, toc, depth=0):
    for item in items:
        if isinstance(item, list):
            walk(item, toc, depth + 1)
        else:
            title = getattr(item, "title", None) or str(item)
            title = re.sub(r"\s+", " ", title).strip()
            if title and depth <= 1:
                toc.append({"title": title, "depth": depth})


for pdf in sorted(pdf_dir.glob("*.pdf")):
    bid = guess_id(pdf.name)
    reader = PdfReader(str(pdf))
    pages = len(reader.pages)
    toc = []
    try:
        outlines = reader.outline
        if outlines:
            walk(outlines, toc)
    except Exception as e:
        toc = [{"error": str(e)}]

    sample_heads = []
    if len(toc) < 5:
        for i in range(min(30, pages)):
            try:
                t = reader.pages[i].extract_text() or ""
            except Exception:
                continue
            for line in t.splitlines():
                line = line.strip()
                if (
                    8 <= len(line) <= 90
                    and line == line.upper()
                    and any(c.isalpha() for c in line)
                    and not line.startswith("HTTP")
                ):
                    if line not in sample_heads:
                        sample_heads.append(line)
                if len(sample_heads) >= 25:
                    break
            if len(sample_heads) >= 25:
                break

    out[bid] = {
        "file": pdf.name,
        "pages": pages,
        "toc_count": len(toc),
        "toc": toc[:50],
        "sample_heads": sample_heads[:25],
    }
    print(f"{bid}: {pages}p toc={len(toc)} :: {pdf.name[:55]}")

dest = Path(__file__).with_name("pdf-scan.json")
dest.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print("wrote", dest)
