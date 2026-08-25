from pathlib import Path
import re
import json

books = Path(r"c:\Users\fabri\Desktop\Progetti\Paroloteca\src\data\books.ts")
t = books.read_text(encoding="utf-8")
t2 = re.sub(r"\n    startHere: (true|false),", "", t)
books.write_text(t2, encoding="utf-8")
print("startHere removed", t.count("startHere"), "->", t2.count("startHere"))

tp = Path(r"c:\Users\fabri\Desktop\Progetti\Paroloteca\src\data\teasers.ts")
tt = tp.read_text(encoding="utf-8")
tt = tt.replace("  keys: string[];\n  sigle: string[];", "  keys: string[];")

# Process each book entry
pattern = re.compile(
    r'(  "[^"]+": \{\n(?:.|\n)*?)(\n    keys: \[(?:.|\n)*?\n    \],)(\n    sigle: \[(?:.|\n)*?\n    \],)',
    re.M,
)


def repl(m: re.Match) -> str:
    head, keys, sigle = m.group(1), m.group(2), m.group(3)
    items = re.findall(r'"([^"]+)"', sigle)
    if items:
        adds = "".join(f"\n      {json.dumps(i, ensure_ascii=False)}," for i in items)
        keys = keys[:-6] + adds + "\n    ],"
    return head + keys


tt2, n = pattern.subn(repl, tt)
print("teaser blocks patched", n)
# leftover empty sigle without keys match
tt2 = re.sub(r"\n    sigle: \[\s*\],", "", tt2)
tp.write_text(tt2, encoding="utf-8")
print("done teasers")
