import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors, createSelector } from '@volkovlabs/jest-selectors';
import React from 'react';

import { AlertBox } from './AlertBox';
import { TEST_IDS } from '../../constants';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof AlertBox>;

describe('Alert box', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.alertBox);
  const selectors = getSelectors(screen);

  /**
   * Get Component
   */
  const getComponent = (props: Partial<Props>) => {
    return <AlertBox {...(props as any)} />;
  };

  it('Should show Alert box', () => {
    const onChange = jest.fn();

    render(getComponent({ error: 'Test Error', title: 'Test title', variant: 'error', onRemove: onChange }));
    expect(selectors.root()).toBeVisible();
  });

  it('Should not show Alert box if no errors', () => {
    const onChange = jest.fn();

    const { queryByTestId } = render(
      getComponent({ error: '', title: 'Test title', variant: 'error', onRemove: onChange })
    );

    expect(queryByTestId(TEST_IDS.alertBox.root.selector())).toBeNull();
  });

  it('Should show Alert box details', () => {
    const onChange = jest.fn();

    render(
      getComponent({ error: 'Test Error text in details', title: 'Test title', variant: 'error', onRemove: onChange })
    );
    expect(selectors.root()).toBeVisible();
    expect(selectors.sectionHeader()).toBeVisible();
    expect(selectors.details(true)).not.toBeInTheDocument();

    fireEvent.click(selectors.sectionHeader());
    expect(selectors.details()).toBeVisible();
    expect(selectors.details()).toHaveTextContent('Test Error text in details');
  });
});
