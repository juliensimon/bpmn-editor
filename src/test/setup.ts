import '@testing-library/jest-dom/vitest';

// Ensure localStorage is available and clearable in the test environment.
// Node.js 22+ provides a built-in localStorage that may shadow jsdom's.
if (typeof localStorage !== 'undefined' && typeof localStorage.clear !== 'function') {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, String(value)),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      get length() { return store.size; },
      key: (index: number) => [...store.keys()][index] ?? null,
    },
    writable: true,
    configurable: true,
  });
}
