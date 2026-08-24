/**
 * Identity contract validator. Wraps contract.schema.json with ajv so the
 * bootstrap flow can fail-closed on unknown fields, missing required fields,
 * or wrong schemaVersion. The schema is the single source of truth for the
 * Identity v1 shape; this module must not re-declare field names.
 */
import Ajv from 'ajv';
import identitySchema from './contract.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(identitySchema);

export function validateIdentity(identity) {
  return validate(identity);
}

export function getIdentityErrors() {
  return validate.errors;
}
