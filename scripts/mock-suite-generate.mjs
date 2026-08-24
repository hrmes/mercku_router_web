#!/usr/bin/env node
// Mock mercku-suite identity generator.
//
// Task 8 (mercku-suite repo) is not in this workspace. This script stands in
// for the suite's atomic `/www/runtime-config.v1.json` generation so the
// Web-side Task 8 Gate can be exercised without the real suite. The real
// suite will replace this once it lands; defaults below mirror a typical
// Mercku (0001) M11R4 device.
//
// Usage:
//   node scripts/mock-suite-generate.mjs [output-path] [options]
//
// Options:
//   --model <id>          modelId (default: M11R4)
//   --customer <id>       customerId (default: 0001)
//   --backend <name>      backend (default: mercku_mtk7621)
//   --caps <k=v,k=v>      detectedCapabilities overrides (e.g. sfp=true,fanControl=false)
//   --revision <tag>      revision tag (default: ISO timestamp with -1 suffix)
//
// Output path defaults to /tmp/runtime-config.v1.json.
// The write is atomic: write to `<dest>.tmp` then rename.
//
// Exit codes:
//   0 - identity written
//   1 - write failed
//   2 - bad CLI usage

import { writeFileSync, renameSync } from 'node:fs';
import path from 'node:path';

const CAPABILITY_KEYS = ['sfp', 'poeControl', 'fanControl', 'frozenConfig'];

function parseArgs(argv) {
  const positional = [];
  const opts = {
    model: 'M11R4',
    customer: '0001',
    backend: 'mercku_mtk7621',
    caps: {},
    revision: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--model') {
      opts.model = argv[++i];
    } else if (arg === '--customer') {
      opts.customer = argv[++i];
    } else if (arg === '--backend') {
      opts.backend = argv[++i];
    } else if (arg === '--revision') {
      opts.revision = argv[++i];
    } else if (arg === '--caps') {
      const raw = argv[++i] || '';
      raw.split(',').map((s) => s.trim()).filter(Boolean).forEach((pair) => {
        const [k, v] = pair.split('=').map((s) => s.trim());
        if (!CAPABILITY_KEYS.includes(k)) {
          process.stderr.write(`error: unknown capability key "${k}". Allowed: ${CAPABILITY_KEYS.join(', ')}\n`);
          process.exit(2);
        }
        opts.caps[k] = v === 'true';
      });
    } else if (arg.startsWith('--')) {
      process.stderr.write(`error: unknown option ${arg}\n`);
      process.exit(2);
    } else {
      positional.push(arg);
    }
  }
  const outPath = positional[0] || '/tmp/runtime-config.v1.json';
  return { outPath, opts };
}

const { outPath, opts } = parseArgs(process.argv.slice(2));

const revision = opts.revision || `${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}-1`;

const identity = {
  schemaVersion: 1,
  revision,
  modelId: opts.model,
  customerId: opts.customer,
  backend: opts.backend,
};
if (Object.keys(opts.caps).length > 0) {
  identity.detectedCapabilities = opts.caps;
}

const tmpPath = `${outPath}.tmp`;
const payload = `${JSON.stringify(identity, null, 2)}\n`;
try {
  writeFileSync(tmpPath, payload, 'utf8');
  renameSync(tmpPath, outPath);
} catch (err) {
  process.stderr.write(`error: failed to write ${outPath}: ${err.message}\n`);
  process.exit(1);
}

process.stdout.write(`generated: ${outPath}\n`);
process.stdout.write(`${JSON.stringify(identity)}\n`);
