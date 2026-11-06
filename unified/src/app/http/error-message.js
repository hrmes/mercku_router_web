const reasons = ['busy', 'invalid-input', 'session-expired', 'apply-failed', 'outcome-unknown', 'unavailable'];
export function errorMessageKey(error) {
  if (error && reasons.includes(error.reason)) return `operation.${error.reason}`;
  return !error || Number(error.code) === 109999 ? 'operation.failed' : error.code;
}

// Only a real credential rejection consumes the login page's password budget.
export function isPasswordRejection(error) {
  return !!(error && error.error && !error.error.reason && Number(error.error.code) === 300102);
}
