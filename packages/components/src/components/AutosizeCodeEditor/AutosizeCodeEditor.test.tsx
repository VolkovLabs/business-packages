import { act, fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors, createSelector } from '@volkovlabs/jest-selectors';
import React from 'react';

import { CODE_EDITOR_CONFIG, TEST_IDS } from '../../constants';
import { AutosizeCodeEditor } from './AutosizeCodeEditor';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof AutosizeCodeEditor>;

/**
 * In Test Ids
 */
const InTestIds = {
  field: createSelector('data-testid field'),
};

/**
 * Mock Code Editor
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: jest.fn(({ value, onChange, height }) => (
    <textarea
      {...InTestIds.field.apply()}
      style={{ height }}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  )),
}));

describe('AutosizeCodeEditor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors({
    ...InTestIds,
    ...TEST_IDS.codeEditor,
  });
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param item
   * @param restProps
   */
  const getComponent = ({ value = '', ...restProps }: Partial<Props>) => {
    return <AutosizeCodeEditor {...(restProps as any)} value={value} />;
  };

  it('Should apply min height if empty value', () => {
    render(getComponent({}));

    expect(selectors.field()).toHaveStyle(`height: ${CODE_EDITOR_CONFIG.height.min}px`);
  });

  it('Should update height on change', () => {
    render(getComponent({}));

    const valueIn20Rows = Array.from(new Array(20))
      .map((value, index) => index)
      .join('\n');

    fireEvent.change(selectors.field(), { target: { value: valueIn20Rows } });

    expect(selectors.field()).toHaveStyle(`height: 360px`);
  });

  it('Should update height if props changed', () => {
    const { rerender } = render(getComponent({}));

    expect(selectors.field()).toHaveStyle(`height: ${CODE_EDITOR_CONFIG.height.min}px`);

    const valueIn20Rows = Array.from(new Array(20))
      .map((value, index) => index)
      .join('\n');

    rerender(getComponent({ value: valueIn20Rows }));

    expect(selectors.field()).toHaveStyle(`height: 360px`);
  });

  it('Should apply max height', () => {
    const valueIn1000Rows = Array.from(new Array(1000))
      .map((value, index) => index)
      .join('\n');

    render(getComponent({ value: valueIn1000Rows }));

    expect(selectors.field()).toHaveStyle(`height: ${CODE_EDITOR_CONFIG.height.max}px`);
  });

  it('Should render modal icon button and open/close modal window', () => {
    render(getComponent({}));

    expect(selectors.modalButton(true, 'modal-button')).toBeInTheDocument();
    expect(selectors.field()).toBeInTheDocument();

    fireEvent.click(selectors.modalButton(true, 'modal-button'));
    expect(selectors.modal()).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(selectors.modal(true)).not.toBeInTheDocument();
  });

  it('Should use code editor in modal window', async () => {
    const onChange = jest.fn();
    render(getComponent({ modalHeight: 400, onChange }));

    expect(selectors.modalButton(true, 'modal-button')).toBeInTheDocument();

    fireEvent.click(selectors.modalButton(true, 'modal-button'));
    expect(selectors.modal()).toBeInTheDocument();

    const elements = screen.getAllByTestId('data-testid field');

    const editor1 = elements[0];
    const editor2 = elements[1];

    expect(editor1).toHaveValue('');
    expect(editor2).toHaveValue('');

    fireEvent.change(editor2, { target: { value: `console.log('test second')` } });

    expect(onChange).toHaveBeenCalledWith(`console.log('test second')`);
  });
});
