/**
 * Profile validators. Both Model Profile and Customer Profile are validated
 * against their v1 JSON Schemas. The schemas (not this file) are the single
 * source of truth for field names, capability keys and policy shape; this
 * module must not re-declare them.
 */
import Ajv from 'ajv';
import modelProfileSchema from './model-profile.schema.json';
import customerProfileSchema from './customer-profile.schema.json';

// `strict: false` — ajv strict mode rejects unknown keywords in our v1
// schemas; the schemas are the source of truth, so we opt out.
const ajv = new Ajv({ allErrors: true, strict: false });
const validateModel = ajv.compile(modelProfileSchema);
const validateCustomer = ajv.compile(customerProfileSchema);

export function validateModelProfile(profile) {
  return validateModel(profile);
}

export function validateCustomerProfile(profile) {
  return validateCustomer(profile);
}

export function getModelProfileErrors() {
  return validateModel.errors;
}

export function getCustomerProfileErrors() {
  return validateCustomer.errors;
}

/**
 * Format ajv error list into a single human-readable string. ajv 6 uses
 * `dataPath` (dot notation); ajv 7+ uses `instancePath` (slash notation) —
 * fall back to either so the helper is robust to either version.
 */
export function summarizeAjvErrors(errors) {
  if (!errors) return '';
  return errors
    .map((e) => {
      const at = e.instancePath || e.dataPath || '<root>';
      return `${at}: ${e.message}`;
    })
    .join('; ');
}
