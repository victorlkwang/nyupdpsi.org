#!/usr/bin/env python3
"""
One-shot generator: parse the historical roster spreadsheet plus the two
existing hardcoded frontend data files and emit prisma/seed-data/roster.json,
which prisma/seed.ts consumes.

This was run once to produce the committed prisma/seed-data/roster.json; it is
kept in the repo as documentation of how that seed was derived. It reads the
original hardcoded frontend rosters (data/activeHouse.ts, data/alumni.ts) which
were removed after the migration, so re-running it requires restoring those
files from git history alongside the spreadsheet:
    python3 scripts/build-roster-json.py /path/to/Zeta_Chapter_Roster.xlsx

Sources of truth at import time:
  * xlsx  -> the complete historical roster (#1 onward) + the big/little chain
  * activeHouse.ts -> who is currently ACTIVE, plus major / grad year / photo
  * alumni.ts      -> photos for the already-listed alumni (by crossing number)
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "prisma" / "seed-data" / "roster.json"


def norm(s):
    """Normalize a name/pledge for fuzzy matching: strip, lowercase, drop
    parentheticals and non-alphanumerics."""
    if s is None:
        return ""
    s = str(s)
    s = re.sub(r"\(.*?\)", "", s)  # drop "(Tito)" etc.
    s = unicodedata.normalize("NFKD", s)
    s = re.sub(r"[^a-z0-9]", "", s.lower())
    return s


def clean(s):
    if s is None:
        return None
    s = str(s).strip()
    return s or None


# ---------------------------------------------------------------------------
# 1. Parse the spreadsheet
# ---------------------------------------------------------------------------
def parse_xlsx(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb["Zeta"]
    classes = []  # {name, term, sortOrder}
    brothers = []  # raw dicts
    current_class = None
    class_re = re.compile(r"^(.*?)\s+Class\s+((?:Spring|Fall)\s+\d{4})\s*$")

    for row in ws.iter_rows(values_only=True):
        num, broid, first, last, pledge, bfirst, blast, bpledge = (list(row) + [None] * 8)[:8]

        # Class header: col B holds "<Name> Class <Term>", other cols mostly empty.
        header = clean(broid) or clean(num)
        if header and class_re.match(str(header)):
            m = class_re.match(str(header))
            name = m.group(1).strip()
            term = m.group(2).strip()
            current_class = name
            classes.append({"name": name, "term": term, "sortOrder": len(classes) + 1})
            continue

        first = clean(first)
        last = clean(last)
        pledge = clean(pledge)
        if not first and not pledge:
            continue  # blank spacer / unfilled future slot
        if first == "First Name" and pledge == "Pledge Name":
            continue  # the column-header row

        # Crossing number lives in col A when it's a plain integer.
        crossing = None
        if isinstance(num, (int, float)) and float(num).is_integer():
            crossing = int(num)

        # Skip de-lettered brothers (marked in the BroID column). They are not
        # part of the displayed roster and have no littles.
        if clean(broid) and "de-letter" in str(broid).lower():
            continue

        brothers.append(
            {
                "crossingNumber": crossing,
                "firstName": first,
                "lastName": last,
                "pledgeName": pledge or first,
                "className": current_class,
                "bigFirst": clean(bfirst),
                # a stray number sometimes sits in the big-last column; ignore it
                "bigLast": clean(blast) if isinstance(blast, str) else None,
                "bigPledge": clean(bpledge),
            }
        )
    return classes, brothers


# ---------------------------------------------------------------------------
# 2. Parse the frontend TS data files
# ---------------------------------------------------------------------------
ENTRY_RE = re.compile(r"\{(.*?)\}", re.S)


def field(block, key):
    m = re.search(rf'{key}:\s*"((?:[^"\\]|\\.)*)"', block)
    return m.group(1) if m else None


def parse_name(name):
    """'First *PLEDGE* Last' -> (first, pledge, last). Handles inner asterisks
    in the pledge (e.g. 'Buck *PA*ZU* Vongnaraj')."""
    if not name:
        return None, None, None
    parts = name.split("*")
    if len(parts) >= 3:
        first = parts[0].strip()
        last = parts[-1].strip()
        pledge = "*".join(parts[1:-1]).strip()
        return first or None, pledge or None, last or None
    return name.strip() or None, None, None


def parse_ts(path):
    text = Path(path).read_text()
    out = {}  # crossingNumber(int) -> dict
    for block in ENTRY_RE.findall(text):
        num = field(block, "number")
        if not num:
            continue
        n = int(re.sub(r"\D", "", num))
        first, pledge, last = parse_name(field(block, "name"))
        out[n] = {
            "src": field(block, "src"),
            "major": field(block, "major") or None,
            "year": field(block, "year") or None,
            "firstName": first,
            "lastName": last,
            "pledgeName": pledge,
            "big": field(block, "big"),
        }
    return out


# ---------------------------------------------------------------------------
# 3. Merge everything
# ---------------------------------------------------------------------------
def key_for(b):
    if b["crossingNumber"] is not None:
        return f"#{b['crossingNumber']}"
    return f"pledge:{norm(b['pledgeName'])}"


def main():
    xlsx_path = sys.argv[1]
    classes, xbros = parse_xlsx(xlsx_path)
    active = parse_ts(ROOT / "data" / "activeHouse.ts")
    alumni = parse_ts(ROOT / "data" / "alumni.ts")

    class_order = {c["name"]: c["sortOrder"] for c in classes}
    by_number = {b["crossingNumber"]: b for b in xbros if b["crossingNumber"] is not None}

    # Add frontend-only members (present on the site but missing from the xlsx,
    # e.g. the newest Beta Lambda class whose rows are still blank).
    frontend_class_of = {}  # number -> class name, discovered from tab context
    for src_map in (active, alumni):
        for n, info in src_map.items():
            if n in by_number:
                continue
            # Locate which class tab this number belongs to by reading the file
            # is overkill; instead attach later via nearest-class heuristic below.
            xbros.append(
                {
                    "crossingNumber": n,
                    "firstName": info["firstName"],
                    "lastName": info["lastName"],
                    "pledgeName": info["pledgeName"] or info["firstName"],
                    "className": None,  # filled in below
                    "bigFirst": None,
                    "bigLast": None,
                    "bigPledge": None,
                    "_frontendBig": info["big"],
                }
            )
            by_number[n] = xbros[-1]

    # Assign classes to frontend-only members by scanning the TS files' tab order.
    for ts_path, src_map in (
        (ROOT / "data" / "activeHouse.ts", active),
        (ROOT / "data" / "alumni.ts", alumni),
    ):
        text = Path(ts_path).read_text()
        # class label is a top-level `"Name": [` key
        current = None
        for line in text.splitlines():
            mlabel = re.match(r'\s*"([^"]+)":\s*\[', line)
            if mlabel and mlabel.group(1) in class_order:
                current = mlabel.group(1)
            mnum = re.search(r'number:\s*"#(\d+)"', line)
            if mnum:
                n = int(mnum.group(1))
                b = by_number.get(n)
                if b is not None and b.get("className") is None and current:
                    b["className"] = current

    # Build lookup indices for big resolution.
    by_pledge = {}
    by_fullname = {}
    for b in xbros:
        by_pledge.setdefault(norm(b["pledgeName"]), []).append(b)
        by_fullname.setdefault((norm(b["firstName"]), norm(b["lastName"])), []).append(b)

    warnings = []

    def resolve_big(b):
        # Frontend-only members carry a 'First *PLEDGE* Last' string instead.
        bf, bl, bp = b.get("bigFirst"), b.get("bigLast"), b.get("bigPledge")
        fallback_str = None
        if b.get("_frontendBig"):
            f, p, l = parse_name(b["_frontendBig"])
            bf, bl, bp = f, l, p
            fallback_str = b["_frontendBig"]
        if not (bf or bp):
            return None, None
        if not fallback_str:
            parts = [x for x in [bf, f"*{bp}*" if bp else None, bl] if x]
            fallback_str = " ".join(parts)

        # (a) unambiguous pledge match, sanity-checked against the name in an
        # order-insensitive way (some bigs are cited first/last-swapped, e.g.
        # "Eu Jie Kuan" for roster member "Kuan Eu"). The surname/first check
        # still rejects same-pledge-name collisions with brothers who aren't in
        # this roster (e.g. two different "Spanky"s).
        cands = by_pledge.get(norm(bp), []) if bp else []
        if len(cands) == 1:
            c = cands[0]
            cited = {norm(bf), norm(bl)} - {""}
            names = {norm(c["firstName"]), norm(c["lastName"])} - {""}
            if not cited or (cited & names):
                return key_for(c), None
        # (b) exact first+last match
        cands = by_fullname.get((norm(bf), norm(bl)), [])
        if len(cands) == 1:
            return key_for(cands[0]), None
        # (c) give up -> display string, no link
        return None, fallback_str

    out_brothers = []
    for b in xbros:
        n = b["crossingNumber"]
        enrich = active.get(n)
        is_active = n in active
        alum_info = alumni.get(n)

        photo = None
        if enrich and enrich["src"]:
            photo = enrich["src"]
        elif alum_info and alum_info["src"] and "incompetent" not in alum_info["src"]:
            photo = alum_info["src"]

        big_key, big_fallback = resolve_big(b)
        if big_fallback:
            warnings.append(f"#{n} {b['pledgeName']}: big unresolved -> '{big_fallback}'")

        if not b["className"]:
            warnings.append(f"#{n} {b['firstName']} {b['pledgeName']}: no class assigned; SKIPPED")
            continue

        year = None
        if enrich and enrich["year"] and enrich["year"].isdigit():
            year = int(enrich["year"])

        out_brothers.append(
            {
                "key": key_for(b),
                "crossingNumber": n,
                "firstName": b["firstName"],
                "lastName": b["lastName"],
                "pledgeName": b["pledgeName"],
                "className": b["className"],
                "status": "ACTIVE" if is_active else "ALUMNI",
                "major": (enrich["major"] if enrich else None) or None,
                "gradYear": year,
                "instagram": None,
                "photoUrl": photo,
                "bigKey": big_key,
                "bigNameFallback": big_fallback,
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"classes": classes, "brothers": out_brothers}, indent=2, ensure_ascii=False)
    )

    print(f"Wrote {OUT.relative_to(ROOT)}")
    print(f"  classes : {len(classes)}")
    print(f"  brothers: {len(out_brothers)}")
    print(f"  active  : {sum(1 for x in out_brothers if x['status'] == 'ACTIVE')}")
    print(f"  linked bigs: {sum(1 for x in out_brothers if x['bigKey'])}")
    print(f"  fallback bigs: {sum(1 for x in out_brothers if x['bigNameFallback'])}")
    if warnings:
        print(f"\n{len(warnings)} warning(s):")
        for w in warnings:
            print("  -", w)


if __name__ == "__main__":
    main()
