import { GetByBoundAttribute } from '@testing-library/react';

/**
 * Jest Selector
 */
type JestSelector<Args extends unknown[]> = (
  noThrowOnNotFound?: boolean,
  ...args: Args
) => ReturnType<GetByBoundAttribute>;

/**
 * Jest Selectors
 */
export type JestSelectors<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => void ? JestSelector<Args> : JestSelector<[]>;
};
