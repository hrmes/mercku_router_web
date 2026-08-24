#!/usr/bin/env node
// Static ID boundary checker for unified/src.
//
// Enforces §1.3 of the refactor plan: concrete MODEL_ID / CUSTOMER_ID strings
// and the literal tokens `MODEL_ID` / `CUSTOMER_ID` are forbidden outside the
// profile registries and per-profile subdirectories.
//
// Allowed locations (excluded from the scan):
//   unified/src/profiles/models/            (registry + per-model profile.json + assets)
//   unified/src/profiles/customers/         (registry + per-customer profile.json + assets)
//
// Forbidden everywhere else under unified/src, in .js / .mjs / .vue files:
//   - The literal identifier tokens `MODEL_ID` and `CUSTOMER_ID` (word boundary).
//   - Any concrete ID string declared as a key in the two registries, when it
//     appears as a quoted string literal ('M11R4', "0007", `M11R4`).
//
// Exit codes:
//   0 — no violations
//   1 — one or more violations printed to stdout
//
// Override the scanned root via MERCKU_UNIFIED_SRC (used by tests).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const unifiedSrc = process.env.MERCKU_UNIFIED_SRC
  ? path.resolve(process.env.MERCKU_UNIFIED_SRC)
  : path.resolve(projectRoot, 'unified/src');

// --- Registry parsing -----------------------------------------------------

/**
 * Extract concrete ID keys declared in a registry file.
 *
 * Recognises:
 *   '0007': ...      (quoted string keys)
 *   "M11R4": ...     (double-quoted string keys)
 *   `ID`: ...        (template-literal keys)
 *   M11R4: ...       (bare identifier keys)
 *
 * Only matches keys that appear immediately after `{` or `,` (with optional
 * whitespace/newlines), so we don't pick up nested values like
 * `default: 'M11R4'`.
 */
function extractRegistryIds(registryPath) {
  if (!existsSync(registryPath)) return [];
  const content = readFileSync(registryPath, 'utf8');
  const ids = new Set();
  // `m` flag so `^` matches line starts; `g` for iteration.
  const keyRe = /(?:^|[{,])\s*(?:'([^']+)'|"([^"]+)"|`([^`]+)`|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/gm;
  let match;
  while ((match = keyRe.exec(content)) !== null) {
    const id = match[1] || match[2] || match[3] || match[4];
    if (!id) continue;
    // Skip the well-known top-level export names that are not IDs.
    if (id === 'modelProfileLoaders' || id === 'customerProfileLoaders') continue;
    ids.add(id);
  }
  return [...ids];
}

const modelsRegistry = path.resolve(unifiedSrc, 'profiles/models/registry.js');
const customersRegistry = path.resolve(unifiedSrc, 'profiles/customers/registry.js');
const modelIds = extractRegistryIds(modelsRegistry);
const customerIds = extractRegistryIds(customersRegistry);
const concreteIds = [...new Set([...modelIds, ...customerIds])];

// --- File walking ---------------------------------------------------------

const excludedSubdirs = [
  path.resolve(unifiedSrc, 'profiles/models'),
  path.resolve(unifiedSrc, 'profiles/customers'),
];

const SCAN_EXTENSIONS = new Set(['.js', '.mjs', '.vue']);

function isExcluded(absPath) {
  return excludedSubdirs.some((dir) => absPath === dir || absPath.startsWith(`${dir}${path.sep}`));
}

function walk(dir, fileList = []) {
  if (!existsSync(dir)) return fileList;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return fileList;
  }
  for (const entry of entries) {
    const abs = path.resolve(dir, entry);
    if (isExcluded(abs)) continue;
    let stat;
    try {
      stat = statSync(abs);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      walk(abs, fileList);
    } else if (stat.isFile() && SCAN_EXTENSIONS.has(path.extname(abs))) {
      fileList.push(abs);
    }
  }
  return fileList;
}

// --- Scanning -------------------------------------------------------------

const FORBIDDEN_TOKENS = ['MODEL_ID', 'CUSTOMER_ID'];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scanFile(filePath, violations) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    FORBIDDEN_TOKENS.forEach((token) => {
      const re = new RegExp(`\\b${token}\\b`);
      if (re.test(line)) {
        violations.push({
          file: filePath,
          line: lineNum,
          kind: 'forbidden-token',
          match: token,
          excerpt: line.trim(),
        });
      }
    });
    concreteIds.forEach((id) => {
      const patterns = [
        new RegExp(`'${escapeRegex(id)}'`),
        new RegExp(`"${escapeRegex(id)}"`),
        new RegExp(`\`${escapeRegex(id)}\``),
      ];
      patterns.forEach((re) => {
        if (re.test(line)) {
          violations.push({
            file: filePath,
            line: lineNum,
            kind: 'concrete-id',
            match: id,
            excerpt: line.trim(),
          });
        }
      });
    });
  });
}

const filesToScan = walk(unifiedSrc);
const violations = [];
filesToScan.forEach((file) => scanFile(file, violations));

if (violations.length === 0) {
  process.stdout.write(
    `ok: no concrete ID or MODEL_ID/CUSTOMER_ID literals outside profiles/ (scanned ${filesToScan.length} file(s))\n`
  );
  process.exit(0);
}

process.stdout.write(
  `error: ${violations.length} ID boundary violation(s) found:\n`
);
violations.forEach((v) => {
  const rel = path.relative(unifiedSrc, v.file);
  process.stdout.write(
    `  ${rel}:${v.line} [${v.kind}] ${v.match} — ${v.excerpt}\n`
  );
});
process.exit(1);
