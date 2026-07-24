/* eslint-disable import/prefer-default-export, import/extensions */
/** Plain error data that can be rendered before Vue starts. */
import { isRetryable } from './bootstrap';

/**
 * Build a retryable error descriptor for the bootstrap failure page.
 *
 * @param {Error|BootstrapError} err  the error thrown by bootstrap()
 * @param {Array} [diagnostics]       diagnostics accumulated during bootstrap
 * @returns {Object} frozen descriptor:
 *   {
 *     retryable: boolean,
 *     code: string,
 *     message: string,
 *     diagnostics: Array
 *   }
 */
export function buildBootstrapErrorDescriptor(err, diagnostics = []) {
  const retryable = isRetryable(err);
  const code = (err && err.code) || 'bootstrap-error';
  const message = (err && err.message) || 'bootstrap failed';
  const descriptor = {
    retryable,
    code,
    message,
    diagnostics: Array.isArray(diagnostics) ? diagnostics.slice() : [],
  };
  Object.freeze(descriptor);
  Object.freeze(descriptor.diagnostics);
  return descriptor;
}
