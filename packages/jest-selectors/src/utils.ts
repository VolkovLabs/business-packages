import { BoundFunctions, Queries, Screen } from '@testing-library/react';

import { JestSelectors, SelectorFn } from './types';

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
        const getValue = typeof selector === 'object' && 'selector' in selector ? selector.selector : selector;
        const value = typeof getValue === 'function' ? getValue(...args) : getValue;

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

/**
 * Create Selector
 * @param selector
 * @param propName
 */
export const createSelector = <TSelector extends SelectorFn>(selector: TSelector | string, propName?: string) => {
  let attrName = 'aria-label';

  if (propName) {
    attrName = propName;
  } else {
    const selectorValue = typeof selector === 'function' ? selector() : selector;
    if (selectorValue.startsWith('data-testid')) {
      attrName = 'data-testid';
    }
  }

  if (typeof selector === 'string') {
    return {
      selector: () => selector,
      apply: () => ({
        [attrName]: selector,
      }),
    };
  }

  return {
    selector,
    apply: (...args: Parameters<typeof selector>) => ({
      [attrName]: selector(...args),
    }),
  };
};
