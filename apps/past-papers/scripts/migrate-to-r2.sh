#!/usr/bin/env bash
#
# Copy the public Supabase Storage buckets to Cloudflare R2.
# Non-destructive: Supabase keeps serving until you delete the buckets yourself.
# Object keys are preserved (<subject>/<component>/<file>.pdf), so the public
# URLs become a clean prefix swap.
#
# Prereqs:
#   - rclone installed (https://rclone.org/install/)
#   - An R2 bucket created in the Cloudflare dashboard (default: scholium-papers)
#
# Run:  set -a; source .env.migrate; set +a; ./scripts/migrate-to-r2.sh
#       (or just export the vars below, then run the script)

set -euo pipefail

# ── Credentials — export before running; never commit these ───────────────────
# Supabase  → Dashboard ▸ Project Settings ▸ Storage ▸ "S3 Connection"
: "${SUPABASE_PROJECT_REF:?Set SUPABASE_PROJECT_REF (e.g. abcdefghijklmnop)}"
: "${SUPABASE_S3_REGION:?Set SUPABASE_S3_REGION (shown beside the S3 endpoint, e.g. ap-south-1)}"
: "${SUPABASE_S3_ACCESS_KEY_ID:?Set SUPABASE_S3_ACCESS_KEY_ID}"
: "${SUPABASE_S3_SECRET_ACCESS_KEY:?Set SUPABASE_S3_SECRET_ACCESS_KEY}"

# Cloudflare → Dashboard ▸ R2 ▸ Manage R2 API Tokens
: "${R2_ACCOUNT_ID:?Set R2_ACCOUNT_ID}"
: "${R2_ACCESS_KEY_ID:?Set R2_ACCESS_KEY_ID}"
: "${R2_SECRET_ACCESS_KEY:?Set R2_SECRET_ACCESS_KEY}"

R2_BUCKET="${R2_BUCKET:-scholium-papers}"

# ── rclone remotes defined via env (nothing written to ~/.config/rclone) ──────
export RCLONE_CONFIG_SUPA_TYPE=s3
export RCLONE_CONFIG_SUPA_PROVIDER=Other
export RCLONE_CONFIG_SUPA_ENDPOINT="https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/s3"
export RCLONE_CONFIG_SUPA_REGION="${SUPABASE_S3_REGION}"
export RCLONE_CONFIG_SUPA_ACCESS_KEY_ID="${SUPABASE_S3_ACCESS_KEY_ID}"
export RCLONE_CONFIG_SUPA_SECRET_ACCESS_KEY="${SUPABASE_S3_SECRET_ACCESS_KEY}"
export RCLONE_CONFIG_SUPA_FORCE_PATH_STYLE=true

export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_REGION=auto
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"

RCLONE_FLAGS=(--checksum --transfers 16 --fast-list --progress)

echo "▶ papers → r2:${R2_BUCKET}"
rclone sync supa:papers "r2:${R2_BUCKET}" "${RCLONE_FLAGS[@]}"

# The question JPGs aren't read by the app, but move them too so they stop
# counting against Supabase. Comment out if you don't need them.
echo "▶ past-papers-questions → r2:${R2_BUCKET}-questions"
rclone sync supa:past-papers-questions "r2:${R2_BUCKET}-questions" "${RCLONE_FLAGS[@]}"

echo
echo "✅ Copy complete. Verify before deleting anything on Supabase:"
echo "   rclone size supa:papers"
echo "   rclone size r2:${R2_BUCKET}"
