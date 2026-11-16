#!/usr/bin/env python3
"""Extrait title / meta description / h1 / canonical des pages prérendues (.next/server/app)."""
import sys, re, html, json, pathlib

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".next/server/app")
rows = []
for f in sorted(root.rglob("*.html")):
    rel = f.relative_to(root).as_posix()
    if rel.startswith("_") or "/_" in rel:
        continue
    path = "/" + rel[:-5]
    if path == "/index":
        path = "/"
    s = f.read_text(encoding="utf-8", errors="ignore")
    t = re.search(r"<title>(.*?)</title>", s, re.S)
    d = re.search(r'<meta name="description" content="(.*?)"', s, re.S)
    c = re.search(r'<link rel="canonical" href="(.*?)"', s)
    h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", s, re.S)
    robots = re.search(r'<meta name="robots" content="(.*?)"', s)
    heads = re.findall(r"<h([1-6])[\s>]", s)
    title = html.unescape(t.group(1)) if t else ""
    desc = html.unescape(d.group(1)) if d else ""
    h1txt = [re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", x))).strip() for x in h1]
    # saut de niveau de titre
    skip = False
    prev = 0
    for h in heads:
        n = int(h)
        if prev and n > prev + 1:
            skip = True
        prev = n
    rows.append({"path": path, "title": title, "tl": len(title), "desc": desc, "dl": len(desc), "canonical": c.group(1) if c else "", "h1": h1txt, "robots": robots.group(1) if robots else "", "skip": skip, "heads": "".join(heads)})

mode = sys.argv[2] if len(sys.argv) > 2 else "table"
if mode == "json":
    print(json.dumps(rows, ensure_ascii=False, indent=1))
else:
    bad_t = [r for r in rows if r["tl"] > 60]
    bad_d = [r for r in rows if r["dl"] > 160 or r["dl"] < 70]
    print(f"{len(rows)} pages · titres > 60 : {len(bad_t)} · descriptions hors 70-160 : {len(bad_d)} · sauts de titres : {sum(r['skip'] for r in rows)} · h1 != 1 : {sum(len(r['h1']) != 1 for r in rows)}")
    for r in rows:
        flag = ("T" if r["tl"] > 60 else "-") + ("D" if (r["dl"] > 160 or r["dl"] < 70) else "-") + ("H" if r["skip"] else "-") + ("1" if len(r["h1"]) != 1 else "-")
        print(f"{flag} {r['tl']:>3} {r['dl']:>3} {r['path']:<52} {r['title']}")
