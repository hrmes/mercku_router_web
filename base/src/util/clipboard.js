// HTTP router pages cannot rely on navigator.clipboard being available.
function copyWithSelection(text) {
  const active = document.activeElement;
  const selectionStart = active && active.selectionStart;
  const selectionEnd = active && active.selectionEnd;
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  try {
    input.select();
    return document.execCommand('copy');
  } catch (error) {
    return false;
  } finally {
    document.body.removeChild(input);
    if (active && typeof active.focus === 'function') {
      active.focus();
      if (typeof selectionStart === 'number' && typeof active.setSelectionRange === 'function') {
        active.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  }
}

export default function copyText(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return Promise.resolve()
      .then(() => navigator.clipboard.writeText(text))
      .then(() => true, () => copyWithSelection(text));
  }
  return Promise.resolve(copyWithSelection(text));
}
