/** Compatibility bridge for reused legacy modules importing `@/store`. */
let currentStore = null;

export function setCurrentStore(store) {
  currentStore = store;
}

function requireStore() {
  if (!currentStore) throw new Error('unified store bridge used before createApp');
  return currentStore;
}

export default {
  get state() {
    return requireStore().state;
  },
  get getters() {
    return requireStore().getters;
  },
  commit(...args) {
    return requireStore().commit(...args);
  },
  dispatch(...args) {
    return requireStore().dispatch(...args);
  },
};
