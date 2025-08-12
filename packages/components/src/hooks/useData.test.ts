import { act, renderHook } from '@testing-library/react';
import { useCallback } from 'react';

import { createUseDataHook } from './useData';

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * With Latency
 * @param result
 * @param timeout
 */
const withLatency = <T>(result: T, timeout = 15): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(result), timeout));
};

type ResponseItem = { id: string };

/**
 * Data Source type for checking type narrowing
 */
type DataSource = {
  api?: {
    getAll: (abortController?: AbortController) => Promise<ResponseItem[]>;
  };
};

describe('useData', () => {
  const defaultDatasource: DataSource = {
    api: {
      getAll: jest.fn(),
    },
  };

  const useData = createUseDataHook<DataSource>();

  it('Should have initial loading', async () => {
    const datasource: DataSource = {
      ...defaultDatasource,
      api: {
        ...defaultDatasource.api,
        getAll: jest.fn(() => withLatency([])),
      },
    };

    const { result } = await act(async () =>
      renderHook(() =>
        useData({
          datasource,
          query: useCallback((datasource) => datasource.api.getAll(), []),
          initial: [],
        })
      )
    );

    expect(result.current.loaded).toBeFalsy();
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBeTruthy();
    expect(result.current.error).toBeFalsy();
  });

  it('Should load data', async () => {
    const datasource = {
      ...defaultDatasource,
      api: {
        ...defaultDatasource.api,
        getAll: jest.fn(() => Promise.resolve([{ id: '1' }, { id: '2' }])),
      },
    };

    const { result } = await act(async () =>
      renderHook(() =>
        useData({
          datasource,
          query: useCallback((datasource) => datasource.api.getAll(), []),
          initial: [],
        })
      )
    );

    expect(result.current.data).toEqual([{ id: '1' }, { id: '2' }]);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeFalsy();
    expect(result.current.loaded).toBeTruthy();
  });

  it('Should return error if no datasource', async () => {
    const datasource = {
      ...defaultDatasource,
      api: {
        ...defaultDatasource.api,
        getAll: jest.fn(() => {
          throw new Error();
        }),
      },
    };

    const { result } = await act(async () =>
      renderHook(() =>
        useData({
          datasource,
          query: useCallback((datasource) => datasource.api.getAll(), []),
          initial: [],
        })
      )
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.loaded).toBeFalsy();
  });

  it('Should return error if api error', async () => {
    const { result } = await act(async () =>
      renderHook(() =>
        useData({
          datasource: null,
          query: useCallback((datasource) => datasource.api.getAll(), []),
          initial: [],
        })
      )
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeTruthy();
    expect(result.current.loaded).toBeFalsy();
  });

  it('Should refresh data', async () => {
    const datasource = {
      ...defaultDatasource,
      api: {
        ...defaultDatasource.api,
        getAll: jest.fn(() => Promise.resolve([{ id: '1' }, { id: '2' }])),
      },
    };

    const { result } = await act(async () =>
      renderHook(() =>
        useData({
          datasource,
          query: useCallback((datasource) => datasource.api.getAll(), []),
          initial: [],
        })
      )
    );

    expect(result.current.data).toEqual([{ id: '1' }, { id: '2' }]);

    jest.mocked(datasource.api.getAll).mockResolvedValue([{ id: '1' }]);

    /**
     * Refresh
     */
    await act(async () => result.current.update());

    /**
     * Check updated result
     */
    expect(result.current.data).toEqual([{ id: '1' }]);
  });

  it('Should cancel previous requests', async () => {
    let isAborted = false;
    const datasource = {
      ...defaultDatasource,
      api: {
        ...defaultDatasource.api,
        getAll: jest.fn((abortController?: AbortController) => {
          return new Promise<ResponseItem[]>((resolve, reject) => {
            setTimeout(() => {
              resolve([{ id: '1' }, { id: '2' }]);
            });
            abortController?.signal.addEventListener('abort', () => {
              reject(new DOMException('Operation aborted', 'AbortError'));
              isAborted = true;
            });
          });
        }),
      },
    };

    const { result } = await act(async () =>
      renderHook(() =>
        useData({
          datasource,
          query: useCallback((datasource, abortController) => datasource.api.getAll(abortController), []),
          initial: [],
        })
      )
    );

    await act(async () => jest.runOnlyPendingTimersAsync());

    expect(result.current.data).toEqual([{ id: '1' }, { id: '2' }]);

    /**
     * Refresh twice
     */
    await act(async () => {
      result.current.update();
      result.current.update();
      await jest.runOnlyPendingTimersAsync();
    });

    /**
     * Check if request aborted
     */
    expect(isAborted).toEqual(true);
  });
});
