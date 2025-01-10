import { act, renderHook } from '@testing-library/react';

import { useLocalStorage } from './useLocalStorage';

describe('Use Local Storage', () => {
  const key = 'testKey';
  const version = 1;

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('Should return undefined if item does not exist', async () => {
    const { result } = renderHook(() => useLocalStorage(key, version));
    const data = await result.current.get();
    expect(data).toBeUndefined();
  });

  it('Should return data if item exists with correct version', async () => {
    const { result } = renderHook(() => useLocalStorage(key, version));

    window.localStorage.setItem(key, JSON.stringify({ version, data: 'testData' }));

    const data = await result.current.get();
    expect(data).toBe('testData');
  });

  it('Should return undefined if item  does not exist correct version', async () => {
    const { result } = renderHook(() => useLocalStorage(key, version));

    window.localStorage.setItem(key, JSON.stringify({ version: 2, data: 'testData' }));

    const data = await result.current.get();
    expect(data).toBeUndefined();
  });

  it('Should update localStorage with new data', async () => {
    const { result } = renderHook(() => useLocalStorage(key, version));

    await act(async () => {
      await result.current.update('newData');
    });

    const data = await result.current.get();
    expect(data).toBe('newData');
  });

  it('Should update localStorage with correct version', async () => {
    const { result } = renderHook(() => useLocalStorage(key, version));

    await act(async () => {
      await result.current.update('newData');
    });

    const storedData = JSON.parse(window.localStorage.getItem(key)!);
    expect(storedData).toEqual({ version, data: 'newData' });
  });
});
