/**
 * Identity loader. Fetches `/runtime-config.v1.json` (served by the device in
 * production, by the dev middleware in development). The returned identity is
 * validated by `./validate.js` upstream in the bootstrap flow.
 *
 * `fetchImpl` is injectable for testability. The default uses the global
 * `fetch` (available in modern browsers and Node 18+).
 */
const DEFAULT_IDENTITY_URL = '/runtime-config.v1.json';

function getDefaultFetch() {
  if (typeof fetch === 'function') {
    return fetch;
  }
  // webpack 4 / Vue CLI 3.1 build target: fall back to a runtime error if
  // fetch is missing. The real implementation in Task 7 may swap in axios.
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
      headers: { Accept: 'application/json' },
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
  let data;
  try {
    data = await response.json();
  } catch (err) {
    const e = new Error(`identity response is not valid JSON: ${err.message}`);
    e.code = 'IDENTITY_PARSE_ERROR';
    e.cause = err;
    throw e;
  }
  return data;
}
