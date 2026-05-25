#!/usr/bin/env python3
"""
Import IGCSE Math questions metadata from CSVs into Supabase.
Usage: python3 import_questions.py
"""

import csv
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Chapter name to number mapping (alphabetically ordered)
CHAPTER_MAP = {
    "Angles and Bearings": 1,
    "Indices": 2,
    "Introduction to Algebra": 3,
    "Operations with Numbers": 4,
    "Using Number": 5,
    "Highest Common Factor HCF": 5,  # Map to Number
    "Number": 5,
    "Circle Properties": 6,
    "Coordinate Geometry": 7,
    "Cumulative Frequency Graphs and Linear Regression": 8,
    "Descriptive Statistics": 9,
    "Functions 1": 10,
    "Functions 2": 11,
    "Mensuration": 12,
    "Probability": 13,
    "Pythagoras' Theorem": 14,
    "Quadratic Expressions": 15,
    "Sequences": 16,
    "Sets": 17,
    "Simultaneous Linear Equations": 18,
    "Symmetry": 19,
    "Triangles": 20,
    "Trigonometry": 21,
    "Unclassified": 22,
    "Vectors and Transformations": 23,
}

CSV_FILES = [
    "/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/Paper 2/questions_classified.csv",
    "/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/Paper 4/questions_classified.csv",
]


def import_csv(csv_path: str):
    """Import a single CSV file into Supabase."""
    print(f"Importing {csv_path}...")

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = []

        for i, row in enumerate(reader):
            try:
                chapter_name = row["Chapter"].strip().strip('"')
                chapter_num = CHAPTER_MAP.get(chapter_name, 22)  # Default to Unclassified

                # Parse numeric values
                y_start = float(row["Y-coordinate start"])
                y_end = float(row["Y-coordinate end"])
                ms_y_start = float(row["MS Y-Start"]) if row["MS Y-Start"] else None
                ms_y_end = float(row["MS Y-End"]) if row["MS Y-End"] else None

                record = {
                    "id": row["ID"].strip(),
                    "paper": row["Paper (Month-Year-TZ)"].strip(),
                    "question_number": int(row["Question Number"]),
                    "chapter_name": chapter_name,
                    "chapter_num": chapter_num,
                    "sub_topic": row["Sub-topic"].strip().strip('"'),
                    "y_start": y_start,
                    "y_end": y_end,
                    "ms_y_start": ms_y_start,
                    "ms_y_end": ms_y_end,
                }
                rows.append(record)

            except (KeyError, ValueError) as e:
                print(f"  Skipping row {i+2}: {e}")
                continue

        # Insert in batches of 100
        batch_size = 100
        for j in range(0, len(rows), batch_size):
            batch = rows[j:j+batch_size]
            try:
                supabase.table("questions_metadata").insert(batch).execute()
                print(f"  Inserted {min(batch_size, len(rows) - j)} rows")
            except Exception as e:
                print(f"  Error inserting batch {j//batch_size}: {e}")
                raise

    print(f"✓ Completed {csv_path}")


if __name__ == "__main__":
    print("Starting import of IGCSE Math questions metadata...\n")

    for csv_file in CSV_FILES:
        if os.path.exists(csv_file):
            import_csv(csv_file)
        else:
            print(f"⚠ File not found: {csv_file}")

    # Verify import
    print("\nVerifying import...")
    response = supabase.table("questions_metadata").select("COUNT", count="exact").execute()
    total = response.count if hasattr(response, 'count') else len(response.data)
    print(f"✓ Total questions imported: {total}")

    # Show chapter distribution
    print("\nChapter distribution:")
    response = supabase.table("questions_metadata").select("chapter_num, COUNT(*)").execute()
    print(response.data[:10] if response.data else "No data")
