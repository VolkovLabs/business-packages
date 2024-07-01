import { GetByBoundAttribute } from '@testing-library/react';

/**
 * Jest Selector
 */
type JestSelector<TArgs extends unknown[]> = (
  noThrowOnNotFound?: boolean,
  ...args: TArgs
) => ReturnType<GetByBoundAttribute>;

/**
 * Check If Selector Object
 */
type IsSelectorObject<TCandidate> = TCandidate extends {
  selector: (...args: unknown[]) => void;
  apply: (...args: unknown[]) => void;
}
  ? TCandidate & { selector: TCandidate['selector']; apply: TCandidate['apply'] }
  : never;

/**
 * Jest Selectors
 */
export type JestSelectors<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => void
    ? JestSelector<Args>
    : T[K] extends IsSelectorObject<T[K]>
      ? JestSelector<Parameters<T[K]['selector']>>
      : JestSelector<[]>;
};

/**
 * Selector Function
 */
export type SelectorFn = (...args: unknown[]) => string;
