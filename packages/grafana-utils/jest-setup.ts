import { matchers } from './matchers';

expect.extend(matchers);

/**
 * Mock window to fix failing tests
 */
Object.defineProperty(global, 'window', {
  get() {
    console.warn('Window is using');
  },
});
