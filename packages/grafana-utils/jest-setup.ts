/**
 * Mock window to fix failing tests
 */
Object.defineProperty(global, 'window', {
  get() {},
});
