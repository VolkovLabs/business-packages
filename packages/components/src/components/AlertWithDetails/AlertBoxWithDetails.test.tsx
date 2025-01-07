import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors, createSelector } from '@volkovlabs/jest-selectors';
import React from 'react';

import { AlertWithDetails } from './AlertBoxWithDetails';
import { TEST_IDS } from '../../constants';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof AlertWithDetails>;

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
    return <AlertWithDetails {...(props as any)} />;
  };

  it('Should show Alert box with details', () => {
    const onChange = jest.fn();

    render(
      getComponent({ error: 'Test Error', title: 'Test title', display: true, variant: 'error', onRemove: onChange })
    );
    expect(selectors.root()).toBeVisible();
  });

  it('Should not show Alert box if disabled', () => {
    const onChange = jest.fn();

    const { queryByTestId } = render(
      getComponent({ error: 'error', title: 'Test title', display: false, variant: 'error', onRemove: onChange })
    );

    expect(queryByTestId(TEST_IDS.alertBox.root.selector())).toBeNull();
  });

  it('Should show Alert box details for errors', () => {
    const onChange = jest.fn();

    render(
      getComponent({
        error: 'Test Error text in details',
        title: 'Test title',
        display: true,
        variant: 'error',
        onRemove: onChange,
      })
    );
    expect(selectors.root()).toBeVisible();
    expect(selectors.sectionHeader()).toBeVisible();
    expect(selectors.details(true)).not.toBeInTheDocument();

    fireEvent.click(selectors.sectionHeader());
    expect(selectors.details()).toBeVisible();
    expect(selectors.details()).toHaveTextContent('Test Error text in details');
  });

  it('Should show Alert box as alert', () => {
    render(
      getComponent({
        error: '',
        title: 'Test title',
        children: 'alert content',
        display: true,
        variant: 'error',
      })
    );

    expect(selectors.root()).toBeVisible();
    expect(selectors.sectionHeader(true)).not.toBeInTheDocument();
    expect(selectors.details(true)).not.toBeInTheDocument();

    expect(selectors.root()).toHaveTextContent('alert content');
  });

  it('Should show Alert with empty content', () => {
    const onChange = jest.fn();

    render(
      getComponent({
        error: '',
        title: '',
        children: '',
        display: true,
        variant: 'error',
      })
    );

    expect(selectors.root()).toBeVisible();
    expect(selectors.sectionHeader(true)).not.toBeInTheDocument();
    expect(selectors.details(true)).not.toBeInTheDocument();
    expect(selectors.root()).toHaveTextContent('');
  });
});
