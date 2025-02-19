import { FormFieldType, RenderFormField } from '../types';
import { FormBuilder } from './form-builder';

describe('Form Builder', () => {
  /**
   * Utils
   */
  const getFieldByPath = <
    TType extends FormFieldType,
    TGroupValue extends object = any,
    TFormValue extends object = TGroupValue,
  >(
    fields: Array<RenderFormField<TFormValue, TGroupValue>>,
    path: string
  ): (RenderFormField<TFormValue, TGroupValue> & { type: TType }) | undefined => {
    return fields.find((field) => field.path === path) as never;
  };

  it('Should add hidden field', () => {
    const form = new FormBuilder<{ hidden: number }>({ path: '', label: '' }).addHidden({
      path: 'hidden',
      defaultValue: 1,
    });

    expect(form.getValue().hidden).toEqual(1);
  });

  it('Should add select field', () => {
    const form = new FormBuilder<{ select: string }>({ path: '', label: '' }).addSelect({
      path: 'select',
      defaultValue: '1',
      options: [
        {
          value: '1',
        },
        {
          value: '2',
        },
      ],
    });

    expect(form.getValue().select).toEqual('1');
  });

  it('Should add radio field', () => {
    const form = new FormBuilder<{ radio: string }>({ path: '', label: '' }).addSelect({
      path: 'radio',
      defaultValue: '1',
      options: [
        {
          value: '1',
        },
        {
          value: '2',
        },
      ],
    });

    expect(form.getValue().radio).toEqual('1');
  });

  it('Should add radio field', () => {
    const form = new FormBuilder<{ radio: string }>({ path: '', label: '' }).addRadio({
      path: 'radio',
      defaultValue: '1',
      options: [
        {
          value: '1',
        },
        {
          value: '2',
        },
      ],
    });

    expect(form.getValue().radio).toEqual('1');
  });

  it('Should add input field', () => {
    const form = new FormBuilder<{ input: string }>({ path: '', label: '' }).addInput({
      path: 'input',
      defaultValue: '1',
    });

    expect(form.getValue().input).toEqual('1');
  });

  it('Should add number input field', () => {
    const form = new FormBuilder<{ numberInput: number }>({ path: '', label: '' }).addNumberInput({
      path: 'numberInput',
      defaultValue: 1,
    });

    expect(form.getValue().numberInput).toEqual(1);
  });

  it('Should add slider field', () => {
    const form = new FormBuilder<{ slider: number }>({ path: '', label: '' }).addSlider({
      path: 'slider',
      defaultValue: 1,
      min: 0,
      max: 0,
    });

    expect(form.getValue().slider).toEqual(1);
  });

  it('Should add color picker field', () => {
    const form = new FormBuilder<{ color: string }>({ path: '', label: '' }).addColorPicker({
      path: 'color',
      defaultValue: '#123',
    });

    expect(form.getValue().color).toEqual('#123');
  });

  it('Should add datetime picker field', () => {
    const date = new Date('2022-02-02');
    const form = new FormBuilder<{ datetime: string }>({ path: '', label: '' }).addDateTimePicker({
      path: 'datetime',
      defaultValue: date.toISOString(),
    });

    expect(form.getValue().datetime).toEqual(date.toISOString());
  });

  it('Should add custom field', () => {
    const form = new FormBuilder<{ custom: string }>({ path: '', label: '' }).addCustom({
      path: 'custom',
      defaultValue: '#123',
      editor: () => null,
    });

    expect(form.getValue().custom).toEqual('#123');
  });

  it('Should add group field', () => {
    const form = new FormBuilder<{ group: { field: string } }>({ path: '', label: '' }).addGroup(
      {
        path: 'group',
        label: '',
      },
      (builder) =>
        builder.addInput({
          path: 'field',
          defaultValue: '123',
        })
    );

    expect(form.getValue().group.field).toEqual('123');
  });

  it('Should set empty group value if no fields', () => {
    const form = new FormBuilder<{ group: { field: string } }>({ path: '', label: '' }).addGroup(
      {
        path: 'group',
        label: '',
      },
      (builder) => builder
    );

    expect(form.getValue().group).toEqual({});
  });

  it('Should set value', () => {
    const form = new FormBuilder<{ input: string; group: { field: string } }>({ path: '', label: '' })
      .addInput({
        path: 'input',
        defaultValue: 'initial1',
      })
      .addGroup(
        {
          path: 'group',
          label: '',
        },
        (builder) =>
          builder.addInput({
            path: 'field',
            defaultValue: 'initial2',
          })
      );

    /**
     * Check initial value
     */
    expect(form.getValue()).toEqual({
      input: 'initial1',
      group: {
        field: 'initial2',
      },
    });

    /**
     * Update value
     */
    form.setValue({
      input: 'updated1',
      group: {
        field: 'updated2',
      },
    });

    /**
     * Check updated value
     */
    expect(form.getValue()).toEqual({
      input: 'updated1',
      group: {
        field: 'updated2',
      },
    });
  });

  it('Should notify about field change', () => {
    const onChangeHandler = jest.fn();

    const form = new FormBuilder<{ input: string }>({
      path: '',
      label: '',
    }).addInput({
      path: 'input',
      defaultValue: '',
    });

    const unsubscribe = form.subscribeOnChange(onChangeHandler);

    /**
     * Set value
     */
    form.setValue({
      input: '1',
    });

    /**
     * Should not be called on
     */
    expect(onChangeHandler).not.toHaveBeenCalled();

    const renderField = form.getFields()[0];

    if (renderField.type === FormFieldType.INPUT) {
      renderField.onChange('2');
    }

    /**
     * Should be called on field update
     */
    expect(onChangeHandler).toHaveBeenCalledWith({
      input: '2',
    });

    /**
     * Unsubscribe from field updates
     */
    unsubscribe();

    if (renderField.type === FormFieldType.INPUT) {
      renderField.onChange('3');
    }

    /**
     * Should not be called after unsubscribed
     */
    expect(onChangeHandler).not.toHaveBeenCalledWith({
      input: '3',
    });
  });

  describe('Render Fields', () => {
    it('Should contain value', () => {
      const form = new FormBuilder<{ input: string; group: { field: string; subGroup: { field: string } } }>({
        path: '',
        label: '',
      })
        .addInput({
          path: 'input',
          defaultValue: 'initial1',
        })
        .addGroup(
          {
            path: 'group',
            label: '',
          },
          (builder) =>
            builder
              .addInput({
                path: 'field',
                defaultValue: 'initial2',
              })
              .addGroup(
                {
                  path: 'subGroup',
                  label: '',
                },
                (builder) =>
                  builder.addInput({
                    path: 'field',
                    defaultValue: 'initial3',
                  })
              )
        );

      expect(form.getFields()[0]).toEqual(
        expect.objectContaining({
          path: 'input',
          value: 'initial1',
        })
      );
      expect(form.getFields()[1]).toEqual(
        expect.objectContaining({
          group: [
            expect.objectContaining({
              path: 'field',
              fullPath: 'group.field',
              value: 'initial2',
            }),
            expect.objectContaining({
              path: 'subGroup',
              fullPath: 'group.subGroup',
              group: [
                expect.objectContaining({
                  path: 'field',
                  fullPath: 'group.subGroup.field',
                  value: 'initial3',
                }),
              ],
            }),
          ],
        })
      );

      const renderField = form.getFields()[0];

      /**
       * Update field value
       */
      if (renderField.type === FormFieldType.INPUT) {
        renderField.onChange('123');
      }

      expect(form.getFields()[0]).toEqual(
        expect.objectContaining({
          value: '123',
        })
      );
    });

    it('Should toggle field visibility', () => {
      type FormValue = {
        input: string;
        input2: string;
        group: { field: string };
        group2: {
          field2: string;
        };
      };
      const form = new FormBuilder<FormValue>({
        path: '',
        label: '',
      })
        .addInput({
          path: 'input',
          defaultValue: '',
          showIf: (config) => config.input !== '',
        })
        .addGroup(
          {
            path: 'group',
            label: '',
            showIf: (config) => config.input !== '',
          },
          (builder) =>
            builder.addInput({
              path: 'field',
              defaultValue: 'initial2',
            })
        )
        .addInput({
          path: 'input2',
          defaultValue: '',
        })
        .addGroup(
          {
            path: 'group2',
            label: '',
          },
          (builder) =>
            builder.addInput({
              path: 'field2',
              defaultValue: '',
              showIf: (config, formConfig) => {
                /**
                 * Check if formConfig contain actual values in root and nested levels
                 */
                return formConfig.input !== '' && formConfig.group.field !== '';
              },
            })
        );

      expect(getFieldByPath<FormFieldType.INPUT, FormValue>(form.getFields(), 'input')).toEqual(
        expect.objectContaining({
          path: 'input',
          value: '',
        })
      );
      expect(getFieldByPath<FormFieldType.INPUT, FormValue>(form.getFields(), 'input')?.showIf()).toBeFalsy();
      expect(getFieldByPath<FormFieldType.GROUP, FormValue>(form.getFields(), 'group')?.showIf()).toBeFalsy();

      /**
       * Should be visible by default
       */
      expect(getFieldByPath<FormFieldType.INPUT, FormValue>(form.getFields(), 'input2')?.showIf()).toBeTruthy();
      expect(getFieldByPath<FormFieldType.GROUP, FormValue>(form.getFields(), 'group2')?.showIf()).toBeTruthy();

      /**
       * Nested field should be hidden by form config
       */
      expect(
        getFieldByPath(
          getFieldByPath<FormFieldType.GROUP, FormValue>(form.getFields(), 'group2')?.group || [],
          'field2'
        )?.showIf()
      ).toBeFalsy();

      const renderField = getFieldByPath<FormFieldType.INPUT, FormValue>(form.getFields(), 'input');

      /**
       * Update field value
       */
      if (renderField?.type === FormFieldType.INPUT) {
        renderField?.onChange('123');
      }

      expect(getFieldByPath<FormFieldType.INPUT, FormValue>(form.getFields(), 'input')?.showIf()).toBeTruthy();
      expect(getFieldByPath<FormFieldType.GROUP, FormValue>(form.getFields(), 'group')?.showIf()).toBeTruthy();
      expect(getFieldByPath<FormFieldType.INPUT, FormValue>(form.getFields(), 'input2')?.showIf()).toBeTruthy();
      expect(
        getFieldByPath(
          getFieldByPath<FormFieldType.GROUP, FormValue>(form.getFields(), 'group2')?.group || [],
          'field2'
        )?.showIf()
      ).toBeTruthy();
    });

    it('Should disable field', () => {
      type FormValue = {
        input: string;
        input2: string;
        group: {
          field: string;
        };
      };
      const form = new FormBuilder<FormValue>({ path: '', label: '' })
        .addInput({
          path: 'input',
          defaultValue: '',
          disableIf: (config) => config.input !== '',
        })
        .addInput({
          path: 'input2',
          defaultValue: '',
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
              disableIf: (config, formConfig) => formConfig.input === '',
            })
        );

      let renderField = form.getFields()[0];

      if (renderField.type === FormFieldType.INPUT) {
        expect(renderField.disableIf()).toBeFalsy();
      }

      const renderField2 = form.getFields()[1];

      /**
       * Should be enabled by default
       */
      if (renderField2.type === FormFieldType.INPUT) {
        expect(renderField2.disableIf()).toBeFalsy();
      }

      /**
       * Check If Disabled by form config
       */
      expect(
        getFieldByPath<FormFieldType.INPUT>(
          getFieldByPath<FormFieldType.GROUP>(form.getFields(), 'group')?.group || [],
          'field'
        )?.disableIf()
      ).toBeTruthy();

      /**
       * Update field value
       */
      if (renderField.type === FormFieldType.INPUT) {
        renderField.onChange('123');
      }

      renderField = form.getFields()[0];

      if (renderField.type === FormFieldType.INPUT) {
        expect(renderField.disableIf()).toBeTruthy();
      }

      /**
       * Check if enabled by form config
       */
      expect(
        getFieldByPath<FormFieldType.INPUT>(
          getFieldByPath<FormFieldType.GROUP>(form.getFields(), 'group')?.group || [],
          'field'
        )?.disableIf()
      ).toBeFalsy();
    });

    it('Should invalidate field', () => {
      type FormValue = { input: string; input2: string; group: { field: string } };
      const form = new FormBuilder<FormValue>({ path: '', label: '' })
        .addInput({
          path: 'input',
          defaultValue: '',
          invalidIf: (config) => config.input !== '',
        })
        .addInput({
          path: 'input2',
          defaultValue: '',
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
              invalidIf: (config, formConfig) => formConfig.input === '',
            })
        );

      let renderField = form.getFields()[0];

      if (renderField.type === FormFieldType.INPUT) {
        expect(renderField.invalidIf()).toBeFalsy();
      }

      const renderField2 = form.getFields()[1];

      /**
       * Should be valid by default
       */
      if (renderField2.type === FormFieldType.INPUT) {
        expect(renderField2.invalidIf()).toBeFalsy();
      }

      /**
       * Check If Invalid by form config
       */
      expect(
        getFieldByPath<FormFieldType.INPUT>(
          getFieldByPath<FormFieldType.GROUP>(form.getFields(), 'group')?.group || [],
          'field'
        )?.invalidIf()
      ).toBeTruthy();

      /**
       * Update field value
       */
      if (renderField.type === FormFieldType.INPUT) {
        renderField.onChange('123');
      }

      renderField = form.getFields()[0];

      if (renderField.type === FormFieldType.INPUT) {
        expect(renderField.invalidIf()).toBeTruthy();
      }

      /**
       * Check If Valid by form config
       */
      expect(
        getFieldByPath<FormFieldType.INPUT>(
          getFieldByPath<FormFieldType.GROUP>(form.getFields(), 'group')?.group || [],
          'field'
        )?.invalidIf()
      ).toBeFalsy();
    });

    it('Should format field error message', () => {
      const form = new FormBuilder<{ input: string; input2: string }>({ path: '', label: '' })
        .addInput({
          path: 'input',
          defaultValue: '',
          getErrorMessage: () => 'error',
        })
        .addInput({
          path: 'input2',
          defaultValue: '',
        });

      const renderField = form.getFields()[0];

      if (renderField.type === FormFieldType.INPUT) {
        expect(renderField.getErrorMessage()).toEqual('error');
      }

      const renderField2 = form.getFields()[1];

      /**
       * Should be empty string by default
       */
      if (renderField2.type === FormFieldType.INPUT) {
        expect(renderField2.getErrorMessage()).toEqual('');
      }
    });

    it('Should disable field options', () => {
      const form = new FormBuilder<{ input: string; input2: string }>({ path: '', label: '' })
        .addRadio({
          path: 'input',
          defaultValue: '',
          options: [],
          disableOptions: () => ['1'],
        })
        .addRadio({
          path: 'input2',
          defaultValue: '',
          options: [],
        });

      const renderField = form.getFields()[0];

      if (renderField.type === FormFieldType.RADIO) {
        expect(renderField.disableOptions()).toEqual(['1']);
      }

      const renderField2 = form.getFields()[1];

      /**
       * Should be empty by default
       */
      if (renderField2.type === FormFieldType.RADIO) {
        expect(renderField2.disableOptions()).toEqual([]);
      }
    });
  });
});
