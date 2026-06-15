#!/usr/bin/env python3
"""
Import a `questions_classified.csv` into the `questions_metadata` table for a
given subject. Adds the subject tag and derives `chapter_num` from the subject's
chapter map (the CSV only carries chapter names). Upserts on (subject, id).

Usage:
  VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
    python3 scripts/import-questions-metadata.py <csv_path> <subject>

Expected CSV columns:
  ID, Chapter, Sub-topic, Paper (Month-Year-TZ), Question Number,
  Y-coordinate start, Y-coordinate end, MS Y-Start, MS Y-End
"""
import csv, json, os, sys, urllib.request, urllib.error

# Chapter name -> number, keyed by subject. Numbers match the R2 folder
# numbering so /generate chapters line up with the browse view.
CHAPTER_NUM = {
    "0606": {
        "Functions": 1,
        "Simultaneous Equations and Quadratics": 2,
        "Factors and Polynomials": 3,
        "Equations, Inequalities and Graphs": 4,
        "Logarithmic and Exponential Functions": 5,
        "Straight-Line Graphs": 6,
        "Coordinate Geometry of the Circle": 7,
        "Circular Measure": 8,
        "Trigonometry": 9,
        "Permutations and Combinations": 10,
        "Series": 11,
        "Calculus – Differentiation 1": 12,
        "Vectors": 13,
        "Calculus – Differentiation 2": 14,
        "Calculus – Integration": 15,
        "Kinematics": 16,
    },
}


def num(v):
    v = (v or "").strip()
    return None if v == "" else float(v)


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: import-questions-metadata.py <csv_path> <subject>")
    csv_path, subject = sys.argv[1], sys.argv[2]
    url = os.environ.get("VITE_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env")
    chmap = CHAPTER_NUM.get(subject)
    if not chmap:
        sys.exit(f"No chapter map defined for subject {subject!r}")

    rows, unmapped = [], set()
    with open(csv_path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            ch = r["Chapter"].strip()
            if ch not in chmap:
                unmapped.add(ch)
                continue
            rows.append({
                "subject": subject,
                "id": r["ID"].strip(),
                "paper": r["Paper (Month-Year-TZ)"].strip(),
                "question_number": int(r["Question Number"]),
                "chapter_name": ch,
                "chapter_num": chmap[ch],
                "sub_topic": r["Sub-topic"].strip(),
                "y_start": num(r["Y-coordinate start"]),
                "y_end": num(r["Y-coordinate end"]),
                "ms_y_start": num(r["MS Y-Start"]),
                "ms_y_end": num(r["MS Y-End"]),
            })

    if unmapped:
        sys.exit("Aborting — chapter names not in the map:\n  " +
                 "\n  ".join(sorted(unmapped)))

    print(f"Parsed {len(rows)} rows for subject {subject}")
    endpoint = url.rstrip("/") + "/rest/v1/questions_metadata?on_conflict=subject,id"
    for i in range(0, len(rows), 500):
        batch = rows[i:i + 500]
        req = urllib.request.Request(
            endpoint, data=json.dumps(batch).encode(), method="POST",
            headers={
                "apikey": key, "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates,return=minimal",
            })
        try:
            urllib.request.urlopen(req)
        except urllib.error.HTTPError as e:
            sys.exit(f"Upsert failed ({e.code}): {e.read().decode()[:600]}")
        print(f"  upserted {i + len(batch)}/{len(rows)}")
    print("✅ done")


if __name__ == "__main__":
    main()
