import {
  ColorOptions,
  CustomOptions,
  FormField,
  FormFieldType,
  HiddenOptions,
  InputOptions,
  IsObject,
  NumberInputOptions,
  RadioOptions,
  RangeSliderOptions,
  RenderFormField,
  SelectOptions,
  SliderOptions,
} from '../types';

/**
 * Form Builder
 */
export class FormBuilder<TObject extends object> {
  private fields: Array<FormField<TObject>> = [];
  private value: TObject = {} as TObject;
  path: string;
  fullPath: string;
  label: string;
  setValueToParent: (value: TObject) => void = () => null;
  onChangeHandler: (value: TObject) => void = () => null;

  constructor({
    path,
    label,
    fullPath = path,
    setValueToParent,
  }: {
    path: string;
    label: string;
    fullPath?: string;
    setValueToParent?: (value: TObject) => void;
  }) {
    this.path = path;
    this.label = label;
    this.fullPath = fullPath;

    if (setValueToParent) {
      this.setValueToParent = setValueToParent;
    }
  }

  /**
   * Add Field
   * @param options
   */
  private addField(options: FormField<TObject>) {
    if (options.type === FormFieldType.GROUP) {
      this.fields.push(options);

      /**
       * Set empty object for group if no fields
       */
      if (!this.value[options.path]) {
        this.setFieldValue(options.path, {} as never);
      }

      return this;
    }

    /**
     * Add Fields
     */
    this.fields.push(options);

    /**
     * Set Initial Value
     */
    this.setFieldValue(options.path, options.defaultValue);

    return this;
  }

  /**
   * Add Select Field
   * @param options
   */
  addHidden<TOptions extends HiddenOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.HIDDEN,
    });
  }

  /**
   * Add Select Field
   * @param options
   */
  addSelect<TOptions extends SelectOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.SELECT,
    });
  }

  /**
   * Add Radio Field
   * @param options
   */
  addRadio<TOptions extends RadioOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.RADIO,
    });
  }

  /**
   * Add Input Field
   * @param options
   */
  addInput<TOptions extends InputOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.INPUT,
    });
  }

  /**
   * Add Number Input Field
   * @param options
   */
  addNumberInput<TOptions extends NumberInputOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.NUMBER_INPUT,
    });
  }

  /**
   * Add Slider Field
   * @param options
   */
  addSlider<TOptions extends SliderOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.SLIDER,
    });
  }

  /**
   * Add Range Slider Field
   * @param options
   */
  addRangeSlider<TOptions extends RangeSliderOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.RANGE_SLIDER,
    });
  }

  /**
   * Add Color Picker Field
   * @param options
   */
  addColorPicker<TOptions extends ColorOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.COLOR,
    });
  }

  /**
   * Add Custom Field
   * @param options
   */
  addCustom<TOptions extends CustomOptions<TObject, TObject[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.CUSTOM,
    });
  }

  /**
   * Add Group
   * @param options
   * @param group
   */
  addGroup<
    TOptions extends {
      path: keyof TObject;
      label: string;
      showIf?: (value: TObject) => boolean;
    },
  >(
    { path, label, showIf = () => true }: TOptions,
    group: (builder: FormBuilder<IsObject<TObject[TOptions['path']]>>) => typeof builder
  ) {
    const builder = new FormBuilder<IsObject<TObject[TOptions['path']]>>({
      path: path as string,
      label,
      fullPath: [this.fullPath, path].filter((p) => !!p).join('.'),
      setValueToParent: (value) => {
        this.setFieldValue(path, value);
      },
    });

    return this.addField({
      path: path,
      group: group(builder),
      type: FormFieldType.GROUP,
      showIf,
    });
  }

  /**
   * Get Value
   */
  getValue() {
    return this.value;
  }

  /**
   * Set Field Value
   * @param name
   * @param value
   */
  setFieldValue(name: keyof TObject, value: TObject[typeof name]) {
    this.value = {
      ...this.value,
      [name]: value,
    };
    this.setValueToParent(this.value);
    this.onChangeHandler(this.value);
  }

  /**
   * Get Fields
   */
  getFields(): Array<RenderFormField<TObject>> {
    return this.fields.map(({ showIf = () => true, ...item }): RenderFormField<TObject> => {
      if (item.type === FormFieldType.GROUP) {
        return {
          ...item,
          path: item.group.path,
          label: item.group.label,
          group: item.group.getFields(),
          showIf: () => showIf(this.value),
          fullPath: item.group.fullPath,
        };
      }

      const { disableIf = () => false, invalidIf = () => false, getErrorMessage = () => '', ...field } = item;

      /**
       * Any due to impossible identify the type
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldValue = this.value[field.path] as any;

      const baseField = {
        value: fieldValue,
        /**
         * Any due to impossible identify the type
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange: (value: any) => this.setFieldValue(field.path, value),
        showIf: () => showIf(this.value),
        disableIf: () => disableIf(this.value),
        invalidIf: () => invalidIf(this.value),
        getErrorMessage: () => getErrorMessage(this.value),
        fullPath: [this.fullPath, field.path].filter((p) => !!p).join('.'),
      };

      switch (field.type) {
        case FormFieldType.RADIO: {
          const { disableOptions = () => [] } = field;
          return {
            ...field,
            ...baseField,
            disableOptions: () => disableOptions(this.value),
          };
        }
        default: {
          return {
            ...field,
            ...baseField,
          };
        }
      }
    });
  }

  /**
   * Set Value
   * @param value
   */
  setValue(value: TObject) {
    this.value = value;

    /**
     * Update values in nested objects
     */
    this.fields.forEach((field) => {
      if (field.type === FormFieldType.GROUP) {
        field.group.setValue(value[field.path] as never);
      }
    });
  }

  subscribeOnChange(handler: (value: TObject) => void) {
    this.onChangeHandler = handler;

    return () => {
      this.onChangeHandler = () => null;
    };
  }
}
