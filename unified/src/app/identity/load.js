/* eslint-disable import/prefer-default-export */
/**
 * Identity loader. POSTs a JSON-RPC request to `/app` (the device backend)
 * with method `system.runtimeConfig`. The returned identity is validated
 * by `./validate.js` upstream in the bootstrap flow.
 *
 * `fetchImpl` is injectable for testability. The default uses the global
 * `fetch` (available in modern browsers and Node 18+).
 */
const DEFAULT_IDENTITY_URL = '/app';

function getDefaultFetch() {
  if (typeof fetch === 'function') {
    return fetch;
  }
  throw new Error('global fetch is not available; pass fetchImpl explicitly');
}

export async function fetchIdentity(
  url = DEFAULT_IDENTITY_URL,
  { fetchImpl } = {}
) {
  const fetchFn = fetchImpl || getDefaultFetch();
  let response;
  try {
    response = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'system.runtimeConfig' }),
      cache: 'no-store',
    });
  } catch (err) {
    const e = new Error(`identity fetch failed: ${err.message}`);
    e.code = 'IDENTITY_FETCH_ERROR';
    e.cause = err;
    throw e;
  }
  if (!response || typeof response.ok === 'boolean' && !response.ok) {
    const status = response && response.status;
    const e = new Error(`identity fetch returned HTTP ${status || 'unknown'}`);
    if (status) e.status = status;
    e.code = 'IDENTITY_HTTP_ERROR';
    throw e;
  }
  let body;
  try {
    body = await response.json();
  } catch (err) {
    const e = new Error(`identity response is not valid JSON: ${err.message}`);
    e.code = 'IDENTITY_PARSE_ERROR';
    e.cause = err;
    throw e;
  }
  if (body && body.error) {
    const e = new Error(`identity request failed: ${body.error.message || 'unknown error'}`);
    e.code = 'IDENTITY_RPC_ERROR';
    throw e;
  }
  return body && body.result;
}
