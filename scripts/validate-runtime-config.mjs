#!/usr/bin/env node
// Validate a single runtime identity JSON file against contract.schema.json.
//
// Usage:
//   node scripts/validate-runtime-config.mjs <path-to-identity.json> [--expected-backends b1,b2,...]
//
// Exit codes:
//   0 — file is valid. Backend mismatch with --expected-backends prints a warning but does not fail.
//   1 — file is missing, unreadable, or fails schema validation.
//   2 — bad CLI usage.
//
// Backend matching is only meaningful when a Model Profile exists; for Task 2 this
// script validates the identity schema standalone and treats --expected-backends
// purely as a dev/CI diagnostic.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Ajv from 'ajv';

const require = createRequire(import.meta.url);
const identitySchema = require('../unified/src/app/identity/contract.schema.json');

function printUsage(stream = process.stderr) {
  stream.write(
    `Usage: node ${path.basename(fileURLToPath(import.meta.url))} <identity.json> [--expected-backends b1,b2,...]\n`
  );
}

function parseArgs(argv) {
  const positional = [];
  let expectedBackends = null;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--expected-backends') {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        process.stderr.write('error: --expected-backends requires a comma-separated value\n');
        process.exit(2);
      }
      expectedBackends = next.split(',').map((s) => s.trim()).filter(Boolean);
      i += 1;
    } else if (arg.startsWith('--')) {
      process.stderr.write(`error: unknown option ${arg}\n`);
      process.exit(2);
    } else {
      positional.push(arg);
    }
  }
  if (positional.length !== 1) {
    printUsage();
    process.exit(2);
  }
  return { identityPath: positional[0], expectedBackends };
}

function loadIdentity(identityPath) {
  let raw;
  try {
    raw = readFileSync(identityPath, 'utf8');
  } catch (err) {
    process.stderr.write(`error: cannot read ${identityPath}: ${err.message}\n`);
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    process.stderr.write(`error: invalid JSON in ${identityPath}: ${err.message}\n`);
    process.exit(1);
  }
  return data;
}

function formatErrors(errors) {
  if (!errors) return '';
  return errors
    .map((e) => {
      const at = e.instancePath || e.dataPath || '<root>';
      return `  at ${at}: ${e.message} (${e.keyword})`;
    })
    .join('\n');
}

const { identityPath, expectedBackends } = parseArgs(process.argv.slice(2));
const identity = loadIdentity(identityPath);

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(identitySchema);

if (!validate(identity)) {
  process.stderr.write(`invalid: ${identityPath}\n`);
  process.stderr.write(`${formatErrors(validate.errors)}\n`);
  process.exit(1);
}

process.stdout.write(`valid: ${identityPath}\n`);

if (expectedBackends && !expectedBackends.includes(identity.backend)) {
  process.stdout.write(
    `warning: backend "${identity.backend}" does not match expectedBackends [${expectedBackends.join(
      ', '
    )}] (diagnostic only, does not block UI)\n`
  );
}
