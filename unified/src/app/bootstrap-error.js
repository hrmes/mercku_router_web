/**
 * Retryable bootstrap error descriptor. Task 3 ships the descriptor only;
 * Task 7 wires it into a real Vue error page.
 *
 * The descriptor is intentionally plain data (no Vue/Router/Store imports) so
 * it can be produced by bootstrap.js before any Vue instance exists.
 */
import { isRetryable } from './bootstrap.js';

/**
 * Build a retryable error descriptor for the bootstrap failure page.
 *
 * @param {Error|BootstrapError} err  the error thrown by bootstrap()
 * @param {Array} [diagnostics]       diagnostics accumulated during bootstrap
 * @returns {Object} frozen descriptor with the shape Task 7 will render:
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
