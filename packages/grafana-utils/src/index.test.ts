import * as module from './index';

describe('Export module', () => {
  it('Should not throw window not defined error', () => {
    expect(module).toBeTruthy();
  });
});
