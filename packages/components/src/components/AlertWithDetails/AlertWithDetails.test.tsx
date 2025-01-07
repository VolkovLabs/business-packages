import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { AlertWithDetails } from './AlertWithDetails';
import { TEST_IDS } from '../../constants';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof AlertWithDetails>;

describe('AlertWithDetails', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.alertWithDetails);
  const selectors = getSelectors(screen);

  /**
   * Get Component
   */
  const getComponent = (props: Partial<Props>) => {
    return <AlertWithDetails {...(props as any)} />;
  };

  it('Should show Alert box with details', () => {
    const onChange = jest.fn();

    render(getComponent({ details: 'Test Error', title: 'Test title', variant: 'error', onRemove: onChange }));
    expect(selectors.root()).toBeVisible();
  });

  it('Should show Alert box details for errors', () => {
    const onChange = jest.fn();

    render(
      getComponent({
        details: 'Test Error text in details',
        title: 'Test title',
        variant: 'error',
        onRemove: onChange,
      })
    );
    expect(selectors.root()).toBeVisible();
    expect(selectors.detailsSectionHeader()).toBeVisible();
    expect(selectors.detailsSectionContent(true)).not.toBeInTheDocument();

    fireEvent.click(selectors.detailsSectionHeader());
    expect(selectors.detailsSectionContent()).toBeVisible();
    expect(selectors.detailsSectionContent()).toHaveTextContent('Test Error text in details');
  });

  it('Should show Alert box as alert', () => {
    render(
      getComponent({
        details: '',
        title: 'Test title',
        children: 'alert content',
        variant: 'error',
      })
    );

    expect(selectors.root()).toBeVisible();
    expect(selectors.detailsSectionHeader(true)).not.toBeInTheDocument();
    expect(selectors.detailsSectionContent(true)).not.toBeInTheDocument();

    expect(selectors.root()).toHaveTextContent('alert content');
  });

  it('Should show Alert with empty content', () => {
    render(
      getComponent({
        details: '',
        title: '',
        children: '',
        variant: 'error',
      })
    );

    expect(selectors.root()).toBeVisible();
    expect(selectors.detailsSectionHeader(true)).not.toBeInTheDocument();
    expect(selectors.detailsSectionContent(true)).not.toBeInTheDocument();
    expect(selectors.root()).toHaveTextContent('');
  });
});
