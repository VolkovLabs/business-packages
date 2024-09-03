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

const editor = {
  getPosition: () => ({
    lineNumber: 12,
    column: 5,
  }),
  focus: () => {},
  setPosition: (value: any) => value,
  revealLineInCenter: (value: any) => value,
  getSelection: () => null,
  executeEdits: (source: any, edits: any) => true,
};

/**
 * Mock Code Editor
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: jest.fn(({ value, onChange, height, onEditorDidMount }) => {
    /**
     * Call the onEditorDidMount callback with the editor instance
     */
    onEditorDidMount(editor, '');

    return (
      <textarea
        {...InTestIds.field.apply()}
        style={{ height }}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    );
  }),
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

    expect(selectors.modalButton(true, 'modal-open')).toBeInTheDocument();
    expect(selectors.field()).toBeInTheDocument();

    fireEvent.click(selectors.modalButton(true, 'modal-open'));
    expect(selectors.modal()).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(selectors.modal(true)).not.toBeInTheDocument();
  });

  it('Should use code editor in modal window', async () => {
    const onChange = jest.fn();
    render(getComponent({ modalHeight: 400, onChange }));

    expect(selectors.modalButton(true, 'modal-open')).toBeInTheDocument();

    fireEvent.click(selectors.modalButton(true, 'modal-open'));
    expect(selectors.modal()).toBeInTheDocument();

    const elements = screen.getAllByTestId('data-testid field');

    const editor1 = elements[0];
    const editor2 = elements[1];

    expect(editor1).toHaveValue('');
    expect(editor2).toHaveValue('');

    fireEvent.change(editor2, { target: { value: `console.log('test second')` } });

    expect(onChange).toHaveBeenCalledWith(`console.log('test second')`);
  });

  it('Should call onEditorDidMount', async () => {
    const onChange = jest.fn();
    const onEditorDidMount = jest.fn();

    jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());

    render(getComponent({ modalHeight: 400, onChange, onEditorDidMount }));

    expect(selectors.modalButton(true, 'modal-open')).toBeInTheDocument();

    expect(onEditorDidMount).toHaveBeenCalledTimes(2);

    fireEvent.click(selectors.modalButton(true, 'modal-open'));
    expect(selectors.modal()).toBeInTheDocument();

    expect(onEditorDidMount).toHaveBeenCalledTimes(6);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);
  });

  it('Should render toolbar buttons', async () => {
    const onChange = jest.fn();
    const onEditorDidMount = jest.fn();

    render(getComponent({ modalHeight: 400, onChange, onEditorDidMount }));

    /**
     * Check modal button
     */
    expect(selectors.modalButton(true, 'modal-open')).toBeInTheDocument();

    /**
     * Check copy button
     */
    expect(selectors.copyButton()).toBeInTheDocument();

    /**
     * Check paste button
     */
    expect(selectors.pasteButton()).toBeInTheDocument();

    /**
     * Click on open modal
     */
    fireEvent.click(selectors.modalButton(true, 'modal-open'));

    /**
     * Check close collapse modal button in toolbar
     */
    expect(selectors.modalButton(true, 'modal-close')).toBeInTheDocument();
  });

  it('Should open/close modal on toolbar button', async () => {
    const onChange = jest.fn();
    const onEditorDidMount = jest.fn();

    jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => cb());

    render(getComponent({ modalHeight: 400, onChange, onEditorDidMount }));

    /**
     * Check modal button
     */
    expect(selectors.modalButton(true, 'modal-open')).toBeInTheDocument();

    /**
     * Open modal
     */
    fireEvent.click(selectors.modalButton(true, 'modal-open'));

    /**
     * Modal should be open
     */
    expect(selectors.modal()).toBeInTheDocument();
    expect(selectors.modalButton(true, 'modal-close')).toBeInTheDocument();

    /**
     * Close modal from toolbar
     */
    fireEvent.click(selectors.modalButton(true, 'modal-close'));

    /**
     * Modal should be close
     */
    expect(selectors.modal(true)).not.toBeInTheDocument();
  });

  describe('copy/paste buttons', () => {
    beforeAll(() => {
      /**
       * Mock navigator.clipboard
       */
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          /**
           * Mock navigator.clipboard writeText
           */
          writeText: jest.fn().mockImplementation(async (text) => {
            return Promise.resolve(text);
          }),
          /**
           * Mock navigator.clipboard readText
           */
          readText: jest.fn().mockImplementation(async (text) => {
            return Promise.resolve(text);
          }),
        },

        /**
         * Allows you to change the property later
         */
        configurable: true,
      });

      /**
       * Use fake timers
       */
      jest.useFakeTimers();
    });

    afterAll(() => {
      /**
       * Use real timers
       */
      jest.useRealTimers();
    });
    it('Should copy code', async () => {
      const onChange = jest.fn();
      const onEditorDidMount = jest.fn();

      render(getComponent({ modalHeight: 400, onChange, onEditorDidMount, value: 'test code' }));

      expect(selectors.copyButton()).toBeInTheDocument();

      /**
       * Click on copy button
       */
      await act(() => fireEvent.click(selectors.copyButton()));

      /**
       * Should display copied text
       */
      expect(selectors.copyPasteText()).toBeInTheDocument();
      expect(selectors.copyPasteText()).toHaveTextContent('Copied!');

      /**
       * Scroll the timers by 2000 ms to call setTimeout
       */
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      /**
       * Should remove copied text
       */
      expect(selectors.copyPasteText()).toHaveTextContent('');
    });

    it('Should paste code', async () => {
      const onChange = jest.fn();
      const onEditorDidMount = jest.fn();

      render(getComponent({ modalHeight: 400, onChange, onEditorDidMount, value: 'test code' }));

      expect(selectors.pasteButton()).toBeInTheDocument();

      /**
       * Click on paste button
       */
      await act(() => fireEvent.click(selectors.pasteButton()));

      /**
       * Should display pasted text
       */
      expect(selectors.copyPasteText()).toBeInTheDocument();
      expect(selectors.copyPasteText()).toHaveTextContent('Pasted!');

      /**
       * Scroll the timers by 2000 ms to call setTimeout
       */
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      /**
       * Should remove copied text
       */
      expect(selectors.copyPasteText()).toHaveTextContent('');
    });
  });
});
