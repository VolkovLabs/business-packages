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

  it('Should update field values on value change', async () => {
    const { result, rerender } = renderHook(() =>
      useFormBuilder<{ group1: { field: string }; group2: { field: string } }>((builder) =>
        builder
          .addGroup(
            {
              path: 'group1',
              label: '',
            },
            (builder) =>
              builder.addInput({
                path: 'field',
                defaultValue: '1',
              })
          )
          .addGroup(
            {
              path: 'group2',
              label: '',
            },
            (builder) =>
              builder.addInput({
                path: 'field',
                defaultValue: '2',
              })
          )
      )
    );

    expect(result.current.fields).toEqual([
      expect.objectContaining({
        group: [
          expect.objectContaining({
            value: '1',
          }),
        ],
      }),
      expect.objectContaining({
        group: [
          expect.objectContaining({
            value: '2',
          }),
        ],
      }),
    ]);

    /**
     * Rerender
     */
    rerender(() => null);

    /**
     * Change state value
     */
    await act(async () => {
      result.current.onChange({
        group1: {
          field: '3',
        },
        group2: {
          field: '4',
        },
      });
    });

    /**
     * Check updated fields
     */
    expect(result.current.fields).toEqual([
      expect.objectContaining({
        group: [
          expect.objectContaining({
            value: '3',
          }),
        ],
      }),
      expect.objectContaining({
        group: [
          expect.objectContaining({
            value: '4',
          }),
        ],
      }),
    ]);
  });
});
