#!/usr/bin/env node
// Compute a deterministic content hash of a built web dist directory.
//
// §6.2 (acceptance): all device/customer installs share byte-identical dist
// files and hashes. This script walks dist-unified/, hashes every file's
// contents in a stable order (sorted relative path), and prints a single
// SHA-256 manifest hash plus an optional per-file manifest.
//
// Usage:
//   node scripts/hash-web-dist.mjs [dist-dir] [--manifest <path>]
//
// Default dist-dir: dist-unified
// --manifest <path>: write a JSON file mapping relative path -> sha256 of
//   that file's contents. The manifest is sorted by path for determinism.
//
// Exit codes:
//   0 - hash computed
//   1 - dist dir missing/unreadable
//   2 - bad CLI usage

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const positional = [];
  let manifestPath = null;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--manifest') {
      manifestPath = argv[++i];
      if (!manifestPath) {
        process.stderr.write('error: --manifest requires a path\n');
        process.exit(2);
      }
    } else if (arg.startsWith('--')) {
      process.stderr.write(`error: unknown option ${arg}\n`);
      process.exit(2);
    } else {
      positional.push(arg);
    }
  }
  return { distDir: positional[0] || 'dist-unified', manifestPath };
}

function walk(dir, fileList = []) {
  if (!existsSync(dir)) return fileList;
  const entries = readdirSync(dir).sort();
  for (const entry of entries) {
    const abs = path.resolve(dir, entry);
    let stat;
    try {
      stat = statSync(abs);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      walk(abs, fileList);
    } else if (stat.isFile()) {
      fileList.push(abs);
    }
  }
  return fileList;
}

const { distDir, manifestPath } = parseArgs(process.argv.slice(2));
const absDistDir = path.resolve(distDir);

if (!existsSync(absDistDir) || !statSync(absDistDir).isDirectory()) {
  process.stderr.write(`error: dist directory not found: ${absDistDir}\n`);
  process.exit(1);
}

const files = walk(absDistDir);
if (files.length === 0) {
  process.stderr.write(`error: dist directory is empty: ${absDistDir}\n`);
  process.exit(1);
}

// Build per-file manifest: relative path -> sha256, sorted by path.
const manifest = {};
const aggregate = createHash('sha256');
files.forEach((abs) => {
  const rel = path.relative(absDistDir, abs);
  const content = readFileSync(abs);
  const hash = createHash('sha256').update(content).digest('hex');
  manifest[rel] = hash;
  // Feed relative path + hash into the aggregate so the top-level hash
  // captures both file contents and the path mapping.
  aggregate.update(rel);
  aggregate.update('\0');
  aggregate.update(hash);
  aggregate.update('\0');
});

const topHash = aggregate.digest('hex');

process.stdout.write(`dist: ${absDistDir}\n`);
process.stdout.write(`files: ${files.length}\n`);
process.stdout.write(`sha256: ${topHash}\n`);

if (manifestPath) {
  const { writeFileSync } = await import('node:fs');
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  process.stdout.write(`manifest: ${manifestPath}\n`);
}
