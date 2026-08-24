/**
 * Assemble one customer's locale catalogues and legacy alias maps.
 *
 * `code-map.json` maps backend error codes to translation keys, while
 * `extra.json` maps API enum values to translation keys. The legacy
 * BasicI18n implementation materialised both into every locale.
 */
export default function buildMessages(catalogues, codeMap, extra) {
  const aliases = { ...codeMap, ...extra };
  const messages = {};

  Object.keys(catalogues).forEach((locale) => {
    const catalogue = { ...catalogues[locale] };
    Object.keys(aliases).forEach((key) => {
      catalogue[key] = catalogue[aliases[key]];
    });
    messages[locale] = catalogue;
  });

  return messages;
}
