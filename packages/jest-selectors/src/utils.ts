import { BoundFunctions, Queries, Screen } from '@testing-library/react';

import { JestSelectors } from './types';

/**
 * Get Jest Selectors
 * @param selectors
 * @param enforceTestIdSelectorForKeys
 */
export const getJestSelectors =
  <TSelectors extends Record<keyof TSelectors, TSelectors[keyof TSelectors]>>(
    selectors: TSelectors,
    enforceTestIdSelectorForKeys: Array<keyof TSelectors> = []
  ): ((screen: Screen | BoundFunctions<Queries>) => JestSelectors<TSelectors>) =>
  (screen) => {
    return Object.entries(selectors).reduce((acc, [key, selector]) => {
      /**
       * Get Element function
       * @param noThrowOnNotFound
       * @param args
       */
      const getElement = (noThrowOnNotFound = false, ...args: unknown[]) => {
        const value = typeof selector === 'function' ? selector(...args) : selector;

        if (value.startsWith('data-testid') || enforceTestIdSelectorForKeys.includes(key as keyof TSelectors)) {
          return noThrowOnNotFound ? screen.queryByTestId(value) : screen.getByTestId(value);
        }

        return noThrowOnNotFound ? screen.queryByLabelText(value) : screen.getByLabelText(value);
      };

      return {
        ...acc,
        [key]: getElement,
      };
    }, {} as JestSelectors<TSelectors>);
  };
