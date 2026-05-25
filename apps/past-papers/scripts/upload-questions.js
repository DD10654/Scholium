#!/usr/bin/env node

/**
 * Upload IGCSE Math question JPG files to Supabase Storage
 * Usage: pnpm upload:questions
 *
 * Requires environment variables in .env:
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = 'past-papers-questions';
const DIRECTORIES = [
  '/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/Paper 2/dist/topical-questions/',
  '/Users/aarav/Desktop/Past Papers/0607 (International Mathematics)/Paper 4/dist/topical-questions/',
];

async function uploadQuestions() {
  console.log('🚀 Starting JPG upload to Supabase Storage...\n');

  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const dir of DIRECTORIES) {
    console.log(`📁 Processing: ${path.basename(path.dirname(dir))}`);

    if (!fs.existsSync(dir)) {
      console.warn(`⚠️  Directory not found: ${dir}\n`);
      continue;
    }

    const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.jpg'));
    console.log(`Found ${files.length} JPG files\n`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filepath = path.join(dir, file);

      try {
        const fileBuffer = fs.readFileSync(filepath);

        // Upload file
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(file, fileBuffer, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          if (error.message.includes('already exists')) {
            console.log(`⏭️  ${file} (already exists)`);
            totalSkipped++;
          } else {
            console.error(`❌ ${file} - ${error.message}`);
            totalErrors++;
          }
        } else {
          console.log(`✅ ${file}`);
          totalUploaded++;
        }

        // Progress every 100 files
        if ((i + 1) % 100 === 0) {
          console.log(`   ... ${i + 1}/${files.length} processed\n`);
        }
      } catch (err) {
        console.error(`❌ ${file} - ${err.message}`);
        totalErrors++;
      }
    }

    console.log();
  }

  console.log('📊 Upload Summary:');
  console.log(`   ✅ Uploaded: ${totalUploaded}`);
  console.log(`   ⏭️  Skipped: ${totalSkipped}`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  console.log(`   📈 Total: ${totalUploaded + totalSkipped + totalErrors}`);

  if (totalUploaded > 0) {
    console.log('\n✨ Upload complete!');
  } else if (totalErrors > 0) {
    console.error('\n❌ Upload failed with errors. Check the logs above.');
    process.exit(1);
  } else {
    console.log('\n⏭️  All files were already uploaded.');
  }
}

uploadQuestions().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
