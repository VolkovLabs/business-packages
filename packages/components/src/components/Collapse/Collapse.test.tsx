import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors, createSelector } from '@volkovlabs/jest-selectors';
import React from 'react';

import { Collapse } from './Collapse';

type Props = React.ComponentProps<typeof Collapse>;

/**
 * In Test Ids
 */
const InTestIds = {
  header: createSelector('data-testid header', 'headerTestId'),
  content: createSelector('data-testid content', 'contentTestId'),
  buttonRemove: createSelector('data-testid button-remove'),
};

/**
 * Get Selectors
 */
const getSelectors = getJestSelectors(InTestIds);

describe('Collapse', () => {
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   */
  const getComponent = (props: Partial<Props>) => {
    return <Collapse {...InTestIds.header.apply()} {...InTestIds.content.apply()} {...props} />;
  };

  it('Should expand content', () => {
    const { rerender } = render(getComponent({ isOpen: false }));

    expect(selectors.content(true)).not.toBeInTheDocument();

    rerender(getComponent({ isOpen: true }));
    expect(selectors.content()).toBeInTheDocument();
  });

  it('Should not allow to expand content if disabled', () => {
    const onToggle = jest.fn();

    render(getComponent({ isOpen: false, isExpandDisabled: true, onToggle }));

    fireEvent.click(selectors.header());

    expect(onToggle).not.toHaveBeenCalled();
  });

  it('Should not allow to collapse content if disabled', () => {
    const onToggle = jest.fn();

    render(getComponent({ isOpen: true, isExpandDisabled: true, onToggle }));

    expect(selectors.header()).toBeInTheDocument();
    expect(selectors.content(false)).toBeInTheDocument();

    fireEvent.click(selectors.header());

    expect(onToggle).not.toHaveBeenCalled();
  });

  it('Actions should not affect collapse state', () => {
    const onToggle = jest.fn();

    /**
     * New
     */
    render(getComponent({ onToggle, actions: <button {...InTestIds.buttonRemove.apply()}>remove</button> }));

    fireEvent.click(selectors.buttonRemove());
    expect(onToggle).not.toHaveBeenCalled();
  });
});
