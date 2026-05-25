#!/usr/bin/env node

/**
 * Import IGCSE Math questions metadata from CSVs into Supabase
 * Usage: node import_questions.js
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../apps/past-papers/.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables');
  console.error('Make sure .env file exists in apps/past-papers/ with:');
  console.error('  VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// Chapter mapping - keep consistent with actual chapter names in CSV
const CHAPTER_MAP = {
  'Angles and Bearings': 1,
  'Indices': 2,
  'Introduction to Algebra': 3,
  'Operations with Numbers': 4,
  'Using Number': 5,
  'Number': 5, // Maps to same chapter as "Using Number"
  'Circle Properties': 6,
  'Coordinate Geometry': 7,
  'Cumulative Frequency Graphs and Linear Regression': 8,
  'Descriptive Statistics': 9,
  'Functions 1': 10,
  'Functions 2': 11,
  'Mensuration': 12,
  'Probability': 13,
  'Pythagoras\' Theorem': 14,
  'Quadratic Expressions': 15,
  'Sequences': 16,
  'Sets': 17,
  'Simultaneous Linear Equations': 18,
  'Symmetry': 19,
  'Triangles': 20,
  'Trigonometry': 21,
  'Unclassified': 22,
  'Vectors and Transformations': 23,
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
    // Simple CSV parsing (works for this structure)
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV respecting quotes
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

async function importCSV(csvPath) {
  console.log(`📁 Processing: ${path.basename(csvPath)}`);

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    return 0;
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  console.log(`Found ${rows.length} questions\n`);

  const records = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      const chapterName = row.Chapter?.trim().replace(/^"|"$/g, '') || 'Unclassified';
      const chapterNum = CHAPTER_MAP[chapterName] || 22; // Default to Unclassified

      const yStart = parseFloat(row['Y-coordinate start']);
      const yEnd = parseFloat(row['Y-coordinate end']);
      const msYStart = row['MS Y-Start']?.trim() ? parseFloat(row['MS Y-Start']) : null;
      const msYEnd = row['MS Y-End']?.trim() ? parseFloat(row['MS Y-End']) : null;

      if (isNaN(yStart) || isNaN(yEnd)) continue;

      records.push({
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
    } catch (err) {
      console.warn(`⚠️  Skipping row ${i + 2}: ${err.message}`);
      continue;
    }
  }

  // Insert in batches of 100
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    try {
      const { error } = await supabase
        .from('questions_metadata')
        .insert(batch);

      if (error) {
        console.error(`❌ Error inserting batch at row ${i}: ${error.message}`);
        throw error;
      }

      inserted += batch.length;
      console.log(`✅ Inserted ${batch.length} rows (total: ${inserted}/${records.length})`);
    } catch (err) {
      console.error(`❌ Fatal error during insert: ${err.message}`);
      throw err;
    }
  }

  console.log(`✓ Completed ${path.basename(csvPath)}\n`);
  return inserted;
}

async function main() {
  console.log('🚀 Starting IGCSE Math questions import...\n');

  let totalInserted = 0;

  for (const csvFile of CSV_FILES) {
    if (fs.existsSync(csvFile)) {
      const count = await importCSV(csvFile);
      totalInserted += count;
    } else {
      console.warn(`⚠️  File not found: ${csvFile}\n`);
    }
  }

  console.log('📊 Import Summary:');
  console.log(`   Total inserted: ${totalInserted}\n`);

  // Verify import
  console.log('🔍 Verifying import...');
  try {
    const { count, error } = await supabase
      .from('questions_metadata')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Error verifying: ${error.message}`);
      return;
    }

    console.log(`✅ Total records in database: ${count}`);

    // Show chapter distribution
    const { data: chapterStats } = await supabase
      .from('questions_metadata')
      .select('chapter_num, chapter_name');

    if (chapterStats && chapterStats.length > 0) {
      console.log('\n📈 Chapter distribution:');
      const dist = {};
      chapterStats.forEach((row) => {
        if (!dist[row.chapter_num]) {
          dist[row.chapter_num] = { name: row.chapter_name, count: 0 };
        }
        dist[row.chapter_num].count++;
      });

      Object.keys(dist)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .slice(0, 10)
        .forEach((num) => {
          console.log(`   Chapter ${num}: ${dist[num].name} (${dist[num].count} questions)`);
        });
      console.log(`   ... and more\n`);
    }

    console.log('✨ Import complete!');
  } catch (err) {
    console.error(`❌ Verification failed: ${err.message}`);
  }
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
