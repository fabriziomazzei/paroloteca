from pypdf import PdfReader
from pathlib import Path
import re
import json

pdf = list(Path(r"C:\Users\fabri\Documents\Libri\Borzacchiello").glob("*BRILLARE*"))[0]
r = PdfReader(str(pdf))
raw = []
for p in r.pages:
    t = p.extract_text() or ""
    for line in t.splitlines():
        line = line.strip()
        if not line:
            continue
        letters = [c for c in line if c.isalpha()]
        if not letters:
            continue
        if sum(1 for c in letters if c.isupper()) / len(letters) < 0.85:
            continue
        if len(line) < 4 or len(line) > 90:
            continue
        low = line.lower()
        if any(x in low for x in ["isbn", "copyright", "pagina", "http"]):
            continue
        raw.append(line)

merged = []
i = 0
while i < len(raw):
    cur = raw[i]
    while i + 1 < len(raw):
        nxt = raw[i + 1]
        if cur[-1] not in "?!.…" and len(cur) < 48 and not cur.endswith(")"):
            cur = cur + " " + nxt
            i += 1
            continue
        break
    merged.append(re.sub(r"\s+", " ", cur).strip())
    i += 1

out = []
seen = set()
skip_exact = {"STELLA", "(UN DIARIO)", "BRILLARE COME UNA"}
for t in merged:
    t = t.replace("\ufffd", "'")
    if t in skip_exact or t in seen:
        continue
    if t.startswith("PER ASPERA AD ASTRA") and any(x.startswith("PER ASPERA") for x in out):
        continue
    seen.add(t)
    out.append(t)

Path(r"c:\Users\fabri\Desktop\Progetti\Paroloteca\tools\brillare-posts.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8"
)
print(len(out))
for x in out:
    print(x)
