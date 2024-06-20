import * as module from './server';

describe('Export module', () => {
  it('Should not throw window not defined error', () => {
    expect(module).toBeTruthy();
  });
});
