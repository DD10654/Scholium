#!/usr/bin/env node

/**
 * Generate SQL INSERT statements from CSV files
 * This creates a .sql file with all INSERT statements
 * Usage: node generate_insert_sql.js
 * Then copy the output SQL file contents to Supabase SQL Editor
 */

import fs from 'fs';
import path from 'path';

// chapter_num aligned with the canonical syllabus display order used in the UI.
// Keys must match the Chapter column in the CSV exactly (including commas).
const CHAPTER_MAP = {
  'Number': 1,
  'Operations with Numbers': 2,
  'Using Number': 3,
  'Angles and Bearings': 4,
  'Triangles, Quadrilaterals and Polygons': 5,
  'Indices, Standard Forms and Surds': 6,
  'Introduction to Algebra': 7,
  'Simultaneous Linear Equations': 8,
  'Symmetry, Congruency and Similarity': 9,
  'Pythagoras\' Theorem': 10,
  'Coordinate Geometry': 11,
  'Mensuration': 12,
  'Quadratic Expressions': 13,
  'Functions 1': 14,
  'Trigonometry': 15,
  'Circle Properties': 16,
  'Vectors and Transformations': 17,
  'Sets': 18,
  'Descriptive Statistics': 19,
  'Cumulative Frequency Graphs and Linear Regression': 20,
  'Probability': 21,
  'Sequences': 22,
  'Functions 2': 23,
  'Unclassified': 24,
};

const CSV_FILES = [
  '/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/Paper 2/questions_classified.csv',
  '/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/Paper 4/questions_classified.csv',
];

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));

    const row = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

async function main() {
  console.log('🚀 Generating SQL INSERT statements...\n');

  let allRecords = [];
  let totalRows = 0;

  for (const csvFile of CSV_FILES) {
    console.log(`📁 Reading: ${path.basename(csvFile)}`);

    if (!fs.existsSync(csvFile)) {
      console.error(`❌ File not found: ${csvFile}`);
      continue;
    }

    const content = fs.readFileSync(csvFile, 'utf-8');
    const rows = parseCSV(content);
    console.log(`   Found ${rows.length} questions\n`);

    for (const row of rows) {
      try {
        const chapterName = row.Chapter?.trim().replace(/^"|"$/g, '') || 'Unclassified';
        const chapterNum = CHAPTER_MAP[chapterName] ?? 24;
        if (!CHAPTER_MAP[chapterName]) {
          console.warn(`⚠️  Unmapped chapter "${chapterName}" → falling back to Unclassified (24)`);
        }

        const yStart = parseFloat(row['Y-coordinate start']);
        const yEnd = parseFloat(row['Y-coordinate end']);
        const msYStart = row['MS Y-Start']?.trim() ? parseFloat(row['MS Y-Start']) : null;
        const msYEnd = row['MS Y-End']?.trim() ? parseFloat(row['MS Y-End']) : null;

        if (isNaN(yStart) || isNaN(yEnd)) continue;

        allRecords.push({
          id: row.ID.trim(),
          paper: row['Paper (Month-Year-TZ)'].trim(),
          question_number: parseInt(row['Question Number']),
          chapter_name: chapterName,
          chapter_num: chapterNum,
          sub_topic: row['Sub-topic'].trim().replace(/^"|"$/g, ''),
          y_start: yStart,
          y_end: yEnd,
          ms_y_start: msYStart,
          ms_y_end: msYEnd,
        });

        totalRows++;
      } catch (err) {
        console.warn(`⚠️  Skipping row: ${err.message}`);
      }
    }
  }

  console.log(`📊 Total records to insert: ${totalRows}\n`);

  // Generate SQL
  let sql = '-- IGCSE Math Questions Metadata\n';
  sql += '-- Generated SQL INSERT statements\n';
  sql += `-- Total records: ${totalRows}\n\n`;
  sql += 'BEGIN TRANSACTION;\n\n';

  for (const record of allRecords) {
    const values = [
      escapeSQL(record.id),
      escapeSQL(record.paper),
      record.question_number,
      record.chapter_num,
      escapeSQL(record.chapter_name),
      escapeSQL(record.sub_topic),
      record.y_start,
      record.y_end,
      record.ms_y_start !== null ? record.ms_y_start : 'NULL',
      record.ms_y_end !== null ? record.ms_y_end : 'NULL',
    ];

    sql += `INSERT INTO questions_metadata (id, paper, question_number, chapter_num, chapter_name, sub_topic, y_start, y_end, ms_y_start, ms_y_end) VALUES (${values.join(', ')});\n`;
  }

  sql += '\nCOMMIT;\n';

  // Write to file
  const outputPath = '/Users/aarav/Desktop/Educational Projects/React-Turborepo/database/insert_questions.sql';
  fs.writeFileSync(outputPath, sql);

  console.log(`✅ SQL file generated: ${outputPath}\n`);
  console.log('📋 Next steps:');
  console.log('1. Open the SQL file above');
  console.log('2. Go to Supabase SQL Editor');
  console.log('3. Copy and paste the entire SQL into a new query');
  console.log('4. Click "Run" to execute\n');
  console.log(`📦 File size: ${(sql.length / 1024).toFixed(2)} KB`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
