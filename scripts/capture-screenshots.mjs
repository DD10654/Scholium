#!/usr/bin/env node
// Boots each app's dev server on a dedicated port, navigates Playwright to
// /demo, and writes a 2x-DPI PNG into apps/scholium-home/src/assets/screenshots/.

import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const outDir = join(repoRoot, 'apps/scholium-home/src/assets/screenshots');

// scrollY scrolls past redundant page chrome (page title, descriptions) before
// the screenshot so the captured frame is dominated by the actual app content.
// Per-target viewport override allows poetry-notes (wider canvas layout) to use
// more horizontal space.
const TARGETS = [
  { slug: 'language-hub', appDir: 'apps/language-hub', port: 5170, scrollY: 220 },
  { slug: 'recall-app',   appDir: 'apps/recall-app',   port: 5171, scrollY: 170 },
  { slug: 'poetry-notes', appDir: 'apps/poetry-notes', port: 5172, scrollY: 0,
    viewport: { width: 1280, height: 760 } },
  { slug: 'past-papers',  appDir: 'apps/past-papers',  port: 5173, scrollY: 180 },
];

// Default tight viewport — closer to the AppCard display aspect ratio (~1.4:1).
const VIEWPORT = { width: 1100, height: 780 };
const DEVICE_SCALE = 2;

function tryConnect(host, port) {
  return new Promise((resolveFn) => {
    const socket = net.createConnection(port, host);
    socket.once('connect', () => { socket.end(); resolveFn(true); });
    socket.once('error', () => { socket.destroy(); resolveFn(false); });
  });
}

async function waitForPort(port, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await tryConnect('127.0.0.1', port)) return;
    if (await tryConnect('::1', port)) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`timeout waiting for :${port}`);
}

function spawnVite(target) {
  console.log(`\n[${target.slug}] starting vite on :${target.port}`);
  const proc = spawn(
    'pnpm',
    ['exec', 'vite', '--port', String(target.port), '--strictPort', '--host', '127.0.0.1'],
    {
      cwd: join(repoRoot, target.appDir),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '0' },
    },
  );
  proc.stdout.on('data', (b) => process.stdout.write(`  [${target.slug}] ${b}`));
  proc.stderr.on('data', (b) => process.stderr.write(`  [${target.slug}] ${b}`));
  return proc;
}

async function killProc(proc) {
  proc.kill('SIGTERM');
  await Promise.race([
    new Promise((r) => proc.once('close', r)),
    new Promise((r) => setTimeout(() => { proc.kill('SIGKILL'); r(); }, 3_000)),
  ]);
}

async function capturePage(browser, target) {
  const ctx = await browser.newContext({
    viewport: target.viewport ?? VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
  });
  const page = await ctx.newPage();
  const url = `http://localhost:${target.port}/demo`;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 20_000 });
    await page.waitForTimeout(800);
    if (target.scrollY) {
      await page.evaluate((y) => window.scrollTo(0, y), target.scrollY);
      await page.waitForTimeout(150);
    }
    const outPath = join(outDir, `${target.slug}.png`);
    await page.screenshot({ path: outPath, fullPage: false, timeout: 20_000 });
    console.log(`[${target.slug}] wrote ${outPath}`);
  } finally {
    await ctx.close();
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  if (!existsSync(outDir)) throw new Error(`output dir missing: ${outDir}`);

  // Use playwright resolved from a workspace that already has it.
  const { chromium } = await import(
    join(repoRoot, 'apps/language-hub/node_modules/playwright/index.mjs')
  );
  const browser = await chromium.launch({ headless: true });
  try {
    for (const target of TARGETS) {
      const proc = spawnVite(target);
      try {
        await Promise.race([
          waitForPort(target.port),
          new Promise((_, rej) => setTimeout(() => rej(new Error('vite boot timeout')), 30_000)),
        ]);
        console.log(`[${target.slug}] port is up — capturing`);
        await Promise.race([
          capturePage(browser, target),
          new Promise((_, rej) => setTimeout(() => rej(new Error('capture timeout')), 30_000)),
        ]);
      } catch (err) {
        console.error(`[${target.slug}] FAILED:`, err.message);
      } finally {
        await killProc(proc);
      }
    }
  } finally {
    await browser.close();
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
