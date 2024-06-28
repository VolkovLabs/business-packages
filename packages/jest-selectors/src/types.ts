import { GetByBoundAttribute } from '@testing-library/react';

/**
 * Jest Selector
 */
type JestSelector<TArgs extends unknown[]> = (
  noThrowOnNotFound?: boolean,
  ...args: TArgs
) => ReturnType<GetByBoundAttribute>;

/**
 * Jest Selectors
 */
export type JestSelectors<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => void ? JestSelector<Args> : JestSelector<[]>;
};

/**
 * Selector Function
 */
export type SelectorFn = (...args: unknown[]) => string;
