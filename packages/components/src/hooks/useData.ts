import { useCallback, useEffect, useState } from 'react';

/**
 * Data Source With Api
 */
type DatasourceWithApi<TDataSource extends { api?: unknown }> = Omit<TDataSource, 'api'> & {
  api: Required<TDataSource>['api'];
};

/**
 * Type for useCallback function
 */
type UseCallback<
  TDataSource extends { api?: unknown },
  T extends (datasource: DatasourceWithApi<TDataSource>) => ReturnType<T>,
> = ((...args: Parameters<T>) => ReturnType<T>) & {
  /**
   * Specified property to check if wrapped in useCallback
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __IS_USE_CALLBACK?: undefined;
};

/**
 * Create Use Data Hook
 */
export const createUseDataHook = <TDataSource extends { api?: unknown }>() => {
  return <TValue>({
    datasource,
    query,
    initial,
  }: {
    datasource: TDataSource | null;
    query: UseCallback<TDataSource, (datasource: DatasourceWithApi<TDataSource>) => Promise<TValue | undefined>>;
    initial: TValue;
  }) => {
    const [data, setData] = useState<TValue>(initial);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    /**
     * Load
     */
    const load = useCallback(async () => {
      if (!datasource || !datasource.api) {
        setError(true);
        setLoaded(false);
        return;
      }

      /**
       * Start Loading
       */
      setLoading(true);
      setError(false);
      setLoaded(false);

      try {
        const data = await query({
          ...datasource,
          api: datasource.api,
        });

        if (data !== undefined) {
          setData(data);
          setLoading(false);
          setLoaded(true);
          setError(false);
        }
      } catch {
        setLoading(false);
        setError(true);
        setLoaded(false);
      }
    }, [datasource, query]);

    /**
     * Load Data
     */
    useEffect(() => {
      load();
    }, [datasource, load, query]);

    return {
      data,
      loading,
      update: load,
      error,
      loaded,
    };
  };
};
