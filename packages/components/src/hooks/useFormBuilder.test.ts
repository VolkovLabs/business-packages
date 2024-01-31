import { act, renderHook } from '@testing-library/react';

import { FormFieldType } from '../types';
import { useFormBuilder } from './useFormBuilder';

describe('UseFormBuilder', () => {
  it('Should keep form value in state', async () => {
    const { result, rerender } = renderHook(() =>
      useFormBuilder<{ input: string }>((builder) =>
        builder.addInput({
          path: 'input',
          defaultValue: '1',
        })
      )
    );

    expect(result.current.value).toEqual({
      input: '1',
    });

    /**
     * Change Value
     */
    await act(async () =>
      result.current.onChange({
        input: '2',
      })
    );

    /**
     * Rerender
     */
    rerender(() => null);

    /**
     * Check updated result
     */
    expect(result.current.value).toEqual({
      input: '2',
    });
  });

  it('Should update state value on field change', async () => {
    const { result, rerender } = renderHook(() =>
      useFormBuilder<{ input: string }>((builder) =>
        builder.addInput({
          path: 'input',
          defaultValue: '1',
        })
      )
    );

    expect(result.current.value).toEqual({
      input: '1',
    });

    /**
     * Change field value
     */
    await act(async () => {
      const field = result.current.fields[0];

      if (field.type === FormFieldType.INPUT) {
        field.onChange('2');
      }
    });

    /**
     * Rerender
     */
    rerender(() => null);

    /**
     * Check updated result
     */
    expect(result.current.value).toEqual({
      input: '2',
    });
  });
});
