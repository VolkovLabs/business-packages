import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { useFormBuilder } from '../../hooks';
import { FormBuilder } from '../../utils';
import { Form } from './Form';

/**
 * In Test Ids
 */
const InTestIds = {
  option: (name: unknown) => `option-${name}`,
};

/**
 * Mock NumberInput
 */
jest.mock('../NumberInput');

describe('Form', () => {
  /**
   * Default Form Name
   */
  const defaultName = 'test';

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors({
    ...TEST_IDS.form,
    ...InTestIds,
  });
  const selectors = getSelectors(screen);

  /**
   * Custom Editor
   */
  const CustomEditor = ({ value, onChange, invalid, ...restProps }: any) => {
    return <input value={value} onChange={(event) => onChange(event.target.value)} {...restProps} />;
  };

  /**
   * Wrapper Component
   */
  const WrapperComponent = <TValue extends object>({
    getForm,
    name,
    expanded,
    onToggleExpanded,
    variant,
    readonly,
  }: {
    getForm: (builder: FormBuilder<TValue>) => FormBuilder<TValue>;
    name: string;
    expanded?: Record<string, boolean>;
    onToggleExpanded?: (expanded: Record<string, boolean>) => void;
    variant?: 'default' | 'inline';
    readonly?: boolean;
  }) => {
    const form = useFormBuilder(getForm);

    return (
      <Form
        value={form.value}
        name={name}
        fields={form.fields}
        expanded={expanded}
        onToggleExpanded={onToggleExpanded}
        variant={variant}
        readonly={readonly}
      />
    );
  };

  /**
   * Get tested component
   */
  const getComponent = <TValue extends object>({
    name = defaultName,
    getForm,
    expanded,
    onToggleExpanded,
    variant,
    readonly,
  }: {
    getForm: (builder: FormBuilder<TValue>) => FormBuilder<TValue>;
    name?: string;
    expanded?: Record<string, boolean>;
    onToggleExpanded?: (expanded: Record<string, boolean>) => void;
    variant?: 'default' | 'inline';
    readonly?: boolean;
  }) => {
    return (
      <WrapperComponent
        name={name}
        getForm={getForm}
        expanded={expanded}
        onToggleExpanded={onToggleExpanded}
        variant={variant}
        readonly={readonly}
      />
    );
  };

  it('Should render component', () => {
    render(
      getComponent<{ input: string }>({
        getForm: (builder) => builder,
      })
    );

    expect(selectors.root(false, defaultName)).toBeInTheDocument();
  });

  describe('Field Render', () => {
    /**
     * Default form
     */
    it.each([
      {
        name: 'input',
        path: 'input',
        getField: selectors.fieldInput,
        defaultValue: '1',
        newValue: '2',
      },
      {
        name: 'select',
        path: 'select',
        getField: selectors.fieldSelect,
        defaultValue: '1',
        newValue: '2',
      },
      {
        name: 'custom',
        path: 'custom',
        getField: selectors.fieldCustom,
        defaultValue: '1',
        newValue: '2',
      },
      {
        name: 'slider',
        path: 'slider',
        getField: selectors.fieldSlider,
        defaultValue: 1,
        newValue: '2',
        expectedValue: 2,
      },
      {
        name: 'range slider',
        path: 'rangeSlider',
        getField: selectors.fieldRangeSlider,
        defaultValue: 0,
        newValue: [5, 6],
        expectedValue: 5,
      },
      {
        name: 'number input',
        path: 'number',
        getField: selectors.fieldNumberInput,
        defaultValue: 1,
        newValue: '2',
        expectedValue: 2,
      },
      {
        name: 'color picker',
        path: 'color',
        getField: selectors.fieldColor,
        defaultValue: '#123',
        newValue: '#222',
      },
    ])('Should render $name field', async ({ path, getField, defaultValue, newValue, expectedValue = newValue }) => {
      render(
        getComponent<{
          input: string;
          select: string;
          custom: string;
          slider: number;
          rangeSlider: [number, number];
          number: number;
          color: string;
        }>({
          getForm: (builder) =>
            builder
              .addInput({
                path: 'input',
                defaultValue: defaultValue as any,
              })
              .addSelect({
                path: 'select',
                defaultValue: defaultValue as any,
                options: [
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                ],
              })
              .addCustom({
                path: 'custom',
                defaultValue: defaultValue as any,
                editor: CustomEditor,
              })
              .addSlider({
                path: 'slider',
                defaultValue: path === 'slider' ? (defaultValue as any) : 0,
                min: 0,
                max: 10,
              })
              .addRangeSlider({
                path: 'rangeSlider',
                defaultValue: [0, 10],
                min: 0,
                max: 10,
              })
              .addNumberInput({
                path: 'number',
                defaultValue: path === 'number' ? (defaultValue as any) : 0,
              })
              .addColorPicker({
                path: 'color',
                defaultValue: defaultValue as any,
              }),
        })
      );

      await waitFor(async () => expect(selectors.root(false, defaultName)).toBeInTheDocument());

      expect(getField(false, path)).toBeInTheDocument();
      expect(getField(false, path)).toHaveValue(defaultValue);

      /**
       * Change Value
       */
      await act(async () => fireEvent.change(getField(false, path), { target: { value: newValue, values: newValue } }));

      expect(getField(false, path)).toHaveValue(expectedValue as any);
    });

    /**
     * Inline form
     */
    it.each([
      {
        name: 'input',
        path: 'input',
        getField: selectors.fieldInput,
        defaultValue: '1',
        newValue: '2',
      },
      {
        name: 'select',
        path: 'select',
        getField: selectors.fieldSelect,
        defaultValue: '1',
        newValue: '2',
      },
      {
        name: 'custom',
        path: 'custom',
        getField: selectors.fieldCustom,
        defaultValue: '1',
        newValue: '2',
      },
      {
        name: 'slider',
        path: 'slider',
        getField: selectors.fieldSlider,
        defaultValue: 1,
        newValue: '2',
        expectedValue: 2,
      },
      {
        name: 'number input',
        path: 'number',
        getField: selectors.fieldNumberInput,
        defaultValue: 1,
        newValue: '2',
        expectedValue: 2,
      },
      {
        name: 'color picker',
        path: 'color',
        getField: selectors.fieldColor,
        defaultValue: '#123',
        newValue: '#222',
      },
      {
        name: 'datetime picker',
        path: 'datetime',
        getField: selectors.fieldDatetime,
        defaultValue: new Date('2022-02-01T02:02:00').toISOString(),
        newValue: new Date('2023-02-02T02:02:00').toISOString(),
      },
    ])(
      'Should render $name inline field',
      async ({ path, getField, defaultValue, newValue, expectedValue = newValue }) => {
        render(
          getComponent<{
            input: string;
            select: string;
            custom: string;
            slider: number;
            number: number;
            color: string;
            group: {
              name: string;
              age: number;
            };
            datetime: string;
          }>({
            variant: 'inline',
            getForm: (builder) =>
              builder
                .addInput({
                  path: 'input',
                  defaultValue: defaultValue as any,
                  view: {
                    row: '1',
                  },
                })
                .addSelect({
                  path: 'select',
                  defaultValue: defaultValue as any,
                  options: [
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                  ],
                  view: {
                    row: '2',
                  },
                })
                .addCustom({
                  path: 'custom',
                  defaultValue: defaultValue as any,
                  editor: CustomEditor,
                  view: {
                    row: '2',
                  },
                })
                .addSlider({
                  path: 'slider',
                  defaultValue: path === 'slider' ? (defaultValue as any) : 0,
                  min: 0,
                  max: 10,
                  view: {
                    row: '3',
                  },
                })
                .addNumberInput({
                  path: 'number',
                  defaultValue: path === 'number' ? (defaultValue as any) : 0,
                  view: {
                    row: '3',
                  },
                })
                .addColorPicker({
                  path: 'color',
                  defaultValue: defaultValue as any,
                  view: {
                    row: '',
                  },
                })
                .addGroup(
                  {
                    path: 'group',
                    label: 'Group',
                  },
                  (builder) =>
                    builder
                      .addInput({
                        path: 'name',
                        defaultValue: '',
                        view: {
                          row: '1,',
                        },
                      })
                      .addSlider({
                        path: 'age',
                        defaultValue: 1,
                        min: 0,
                        max: 10,
                        view: {
                          row: '1,',
                        },
                      })
                )
                .addDateTimePicker({
                  path: 'datetime',
                  defaultValue: new Date('2022-02-01T02:02:00').toISOString(),
                }),
          })
        );

        await waitFor(async () => expect(selectors.root(false, defaultName)).toBeInTheDocument());

        expect(getField(false, path)).toBeInTheDocument();
        expect(getField(false, path)).toHaveValue(defaultValue);

        /**
         * Change Value
         */
        await act(async () => fireEvent.change(getField(false, path), { target: { value: newValue } }));

        expect(getField(false, path)).toHaveValue(expectedValue);
      }
    );

    /**
     * Readonly form
     */
    it.each([
      {
        name: 'input',
        path: 'input',
        getField: selectors.fieldInput,
      },
      {
        name: 'select',
        path: 'select',
        getField: selectors.fieldSelect,
      },
      {
        name: 'custom',
        path: 'custom',
        getField: selectors.fieldCustom,
      },
      {
        name: 'slider',
        path: 'slider',
        getField: selectors.fieldSlider,
      },
      {
        name: 'range slider',
        path: 'rangeSlider',
        getField: selectors.fieldRangeSlider,
      },
      {
        name: 'number input',
        path: 'number',
        getField: selectors.fieldNumberInput,
      },
      {
        name: 'color picker',
        path: 'color',
        getField: selectors.fieldColor,
      },
    ])('Should render $name field in readonly state', async ({ path, getField }) => {
      render(
        getComponent<{
          input: string;
          select: string;
          custom: string;
          slider: number;
          rangeSlider: [number, number];
          number: number;
          color: string;
          datetime: string;
        }>({
          getForm: (builder) =>
            builder
              .addInput({
                path: 'input',
                defaultValue: '',
              })
              .addSelect({
                path: 'select',
                defaultValue: '',
                options: [
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                ],
              })
              .addCustom({
                path: 'custom',
                defaultValue: '',
                editor: CustomEditor,
              })
              .addSlider({
                path: 'slider',
                defaultValue: 0,
                min: 0,
                max: 10,
              })
              .addRangeSlider({
                path: 'rangeSlider',
                defaultValue: [0, 10],
                min: 0,
                max: 10,
              })
              .addNumberInput({
                path: 'number',
                defaultValue: 0,
              })
              .addColorPicker({
                path: 'color',
                defaultValue: '',
              })
              .addDateTimePicker({
                path: 'datetime',
                defaultValue: '',
              }),
          readonly: true,
        })
      );

      await waitFor(async () => expect(selectors.root(false, defaultName)).toBeInTheDocument());

      expect(getField(false, path)).toBeInTheDocument();

      /**
       * Color picker can't be disabled
       */
      if (path !== 'color') {
        expect(getField(false, path)).toBeDisabled();
      } else {
        /**
         * Change Value
         */
        await act(async () => fireEvent.change(getField(false, path), { target: { value: '#ff0' } }));

        /**
         * Check if value can't be changed
         */
        expect(getField(false, path)).not.toHaveValue('#ff0');
      }
    });

    it('Should render radio group', async () => {
      render(
        getComponent<{
          radio: boolean;
        }>({
          getForm: (builder) =>
            builder.addRadio({
              path: 'radio',
              defaultValue: false,
              options: [
                { value: true, label: '1', ariaLabel: InTestIds.option(true) },
                { value: false, label: '2', ariaLabel: InTestIds.option(false) },
              ],
            }),
        })
      );

      const field = selectors.fieldRadio(false, 'radio');
      expect(field).toBeInTheDocument();

      const fieldSelectors = getSelectors(within(field));
      expect(fieldSelectors.option(false, true)).not.toBeChecked();

      /**
       * Change Value
       */
      await act(async () => fireEvent.click(fieldSelectors.option(false, true)));

      expect(fieldSelectors.option(false, true)).toBeChecked();
    });

    it('Should render group and expanded by default', () => {
      render(
        getComponent<{
          group1: {
            field: string;
            subGroup1: {
              field: string;
            };
          };
          group2: {
            field: string;
          };
        }>({
          getForm: (builder) =>
            builder
              .addGroup(
                {
                  path: 'group1',
                  label: '',
                },
                (builder) =>
                  builder
                    .addInput({
                      path: 'field',
                      defaultValue: '',
                    })
                    .addGroup(
                      {
                        path: 'subGroup1',
                        label: '',
                      },
                      (builder) =>
                        builder.addInput({
                          path: 'field',
                          defaultValue: '',
                        })
                    )
              )
              .addGroup(
                {
                  path: 'group2',
                  label: '',
                },
                (builder) =>
                  builder.addInput({
                    path: 'field',
                    defaultValue: '',
                  })
              ),
        })
      );

      /**
       * Check group 1
       */
      expect(selectors.sectionHeader(false, 'group1')).toBeInTheDocument();
      expect(selectors.sectionContent(false, 'group1')).toBeInTheDocument();
      expect(selectors.fieldInput(false, 'group1.field')).toBeInTheDocument();

      /**
       * Check subGroup 1
       */
      expect(selectors.sectionHeader(false, 'group1.subGroup1')).toBeInTheDocument();
      expect(selectors.sectionContent(false, 'group1.subGroup1')).toBeInTheDocument();
      expect(selectors.fieldInput(false, 'group1.subGroup1.field')).toBeInTheDocument();

      /**
       * Check group 2
       */
      expect(selectors.sectionHeader(false, 'group2')).toBeInTheDocument();
      expect(selectors.sectionContent(false, 'group2')).toBeInTheDocument();
      expect(selectors.fieldInput(false, 'group2.field')).toBeInTheDocument();

      /**
       * Collapse group2
       */
      fireEvent.click(selectors.sectionHeader(false, 'group2'));

      /**
       * Check if group2 is collapsed
       */
      expect(selectors.sectionContent(true, 'group2')).not.toBeInTheDocument();
    });

    it('Should expand groups', () => {
      const onToggleExpanded = jest.fn();

      render(
        getComponent<{
          group1: {
            field: string;
            subGroup1: {
              field: string;
            };
          };
          group2: {
            field: string;
          };
        }>({
          getForm: (builder) =>
            builder
              .addGroup(
                {
                  path: 'group1',
                  label: '',
                },
                (builder) =>
                  builder
                    .addInput({
                      path: 'field',
                      defaultValue: '',
                    })
                    .addGroup(
                      {
                        path: 'subGroup1',
                        label: '',
                      },
                      (builder) =>
                        builder.addInput({
                          path: 'field',
                          defaultValue: '',
                        })
                    )
              )
              .addGroup(
                {
                  path: 'group2',
                  label: '',
                },
                (builder) =>
                  builder.addInput({
                    path: 'field',
                    defaultValue: '',
                  })
              ),
          expanded: {
            group1: false,
            'group1.subGroup1': false,
          },
          onToggleExpanded,
        })
      );

      /**
       * Check group 1 is collapsed
       */
      expect(selectors.sectionHeader(false, 'group1')).toBeInTheDocument();
      expect(selectors.sectionContent(true, 'group1')).not.toBeInTheDocument();

      /**
       * Check group 2 is expanded by default
       */
      expect(selectors.sectionHeader(false, 'group2')).toBeInTheDocument();
      expect(selectors.sectionContent(false, 'group2')).toBeInTheDocument();

      /**
       * Expand group 1
       */
      fireEvent.click(selectors.sectionHeader(false, 'group1'));
      expect(onToggleExpanded).toHaveBeenCalledWith(
        {
          group1: true,
          'group1.subGroup1': false,
        },
        { path: 'group1', expanded: true }
      );

      /**
       * Check if subGroup1 is collapsed
       */
      expect(selectors.sectionHeader(false, 'group1.subGroup1')).toBeInTheDocument();
      expect(selectors.sectionContent(true, 'group1.subGroup1')).not.toBeInTheDocument();

      /**
       * Expand subGroup 1
       */
      fireEvent.click(selectors.sectionHeader(false, 'group1.subGroup1'));
      expect(onToggleExpanded).toHaveBeenCalledWith(
        {
          group1: false,
          'group1.subGroup1': true,
        },
        { path: 'group1.subGroup1', expanded: true }
      );

      /**
       * Check if subGroup1 is expanded
       */
      expect(selectors.sectionHeader(false, 'group1.subGroup1')).toBeInTheDocument();
      expect(selectors.sectionContent(false, 'group1.subGroup1')).toBeInTheDocument();
    });

    it('Should hide field', () => {
      render(
        getComponent<{
          field: string;
          field2: string;
          group: {
            field: string;
          };
        }>({
          getForm: (builder) =>
            builder
              .addInput({
                path: 'field',
                defaultValue: '',
              })
              .addInput({
                path: 'field2',
                defaultValue: '',
                showIf: (config) => config.field !== '',
              })
              .addGroup(
                {
                  path: 'group',
                  label: '',
                },
                (builder) =>
                  builder.addInput({
                    path: 'field',
                    defaultValue: '',
                    showIf: (config, formConfig) => formConfig.field !== '',
                  })
              ),
        })
      );

      /**
       * Should be hidden
       */
      expect(selectors.fieldInput(true, 'field2')).not.toBeInTheDocument();
      expect(selectors.fieldInput(true, 'group.field')).not.toBeInTheDocument();

      /**
       * Update dependent field
       */
      fireEvent.change(selectors.fieldInput(false, 'field'), { target: { value: '123' } });

      /**
       * Should be visible now
       */
      expect(selectors.fieldInput(false, 'field2')).toBeInTheDocument();
      expect(selectors.fieldInput(false, 'group.field')).toBeInTheDocument();
    });

    it('Should disable field', () => {
      render(
        getComponent<{
          field: string;
          slider: number;
        }>({
          getForm: (builder) =>
            builder
              .addInput({
                path: 'field',
                defaultValue: '',
                disableIf: () => true,
              })
              .addSlider({
                path: 'slider',
                defaultValue: 0,
                min: 0,
                max: 10,
                disableIf: () => true,
              }),
        })
      );

      /**
       * Input should be disabled
       */
      expect(selectors.fieldInput(false, 'field')).toBeDisabled();

      /**
       * Slider should be disabled
       */
      expect(selectors.fieldSlider(false, 'slider')).toBeDisabled();
    });

    it('Should show error message field', () => {
      render(
        getComponent<{
          field: string;
        }>({
          getForm: (builder) =>
            builder.addInput({
              path: 'field',
              defaultValue: '',
              invalidIf: () => true,
              getErrorMessage: () => 'error message',
            }),
        })
      );

      /**
       * Should show error message
       * We have to check <Field> so too many parentNode
       */
      expect(selectors.fieldInput(false, 'field').parentNode?.parentNode?.parentNode?.parentNode).toContainHTML(
        'error message'
      );
    });
  });
});
