import {
  ColorOptions,
  CustomOptions,
  DateTimePickerOptions,
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
import { set } from 'lodash';

/**
 * Form Builder
 */
export class FormBuilder<TFormValue extends object, TGroupValue extends object = TFormValue> {
  private fields: Array<FormField<TFormValue, TGroupValue>> = [];
  private formValue: TFormValue;
  private value: TGroupValue = {} as TGroupValue;
  path: string;
  fullPath: string;
  label: string;
  setValueToParent: (value: TGroupValue) => void = () => null;
  onChangeHandler: (value: TGroupValue) => void = () => null;

  constructor({
    path,
    label,
    fullPath = path,
    setValueToParent,
    formValue = {} as TFormValue,
  }: {
    path: string;
    label: string;
    fullPath?: string;
    setValueToParent?: (value: TGroupValue) => void;
    formValue?: TFormValue;
  }) {
    this.path = path;
    this.label = label;
    this.fullPath = fullPath;
    this.formValue = formValue;

    if (setValueToParent) {
      this.setValueToParent = setValueToParent;
    }
  }

  /**
   * Add Field
   * @param options
   */
  private addField(options: FormField<TFormValue, TGroupValue>) {
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
  addHidden<TOptions extends HiddenOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.HIDDEN,
    });
  }

  /**
   * Add Select Field
   * @param options
   */
  addSelect<TOptions extends SelectOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.SELECT,
    });
  }

  /**
   * Add Radio Field
   * @param options
   */
  addRadio<TOptions extends RadioOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.RADIO,
    });
  }

  /**
   * Add Input Field
   * @param options
   */
  addInput<TOptions extends InputOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.INPUT,
    });
  }

  /**
   * Add Number Input Field
   * @param options
   */
  addNumberInput<TOptions extends NumberInputOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(
    options: TOptions
  ) {
    return this.addField({
      ...options,
      type: FormFieldType.NUMBER_INPUT,
    });
  }

  /**
   * Add Slider Field
   * @param options
   */
  addSlider<TOptions extends SliderOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(options: TOptions) {
    return this.addField({
      ...options,
      type: FormFieldType.SLIDER,
    });
  }

  /**
   * Add Range Slider Field
   * @param options
   */
  addRangeSlider<TOptions extends RangeSliderOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(
    options: TOptions
  ) {
    return this.addField({
      ...options,
      type: FormFieldType.RANGE_SLIDER,
    });
  }

  /**
   * Add Color Picker Field
   * @param options
   */
  addColorPicker<TOptions extends ColorOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(
    options: TOptions
  ) {
    return this.addField({
      ...options,
      type: FormFieldType.COLOR,
    });
  }

  /**
   * Add Date Time Picker Field
   * @param options
   */
  addDateTimePicker<TOptions extends DateTimePickerOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(
    options: TOptions
  ) {
    return this.addField({
      ...options,
      type: FormFieldType.DATETIME_PICKER,
    });
  }

  /**
   * Add Custom Field
   * @param options
   */
  addCustom<TOptions extends CustomOptions<TFormValue, TGroupValue, TGroupValue[TOptions['path']]>>(options: TOptions) {
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
      path: keyof TGroupValue;
      label: string;
      showIf?: (value: TGroupValue, form: TFormValue) => boolean;
    },
  >(
    { path, label, showIf = () => true }: TOptions,
    group: (builder: FormBuilder<TFormValue, IsObject<TGroupValue[TOptions['path']]>>) => typeof builder
  ) {
    const fullPath = [this.fullPath, path].filter((p) => !!p).join('.');
    const builder = new FormBuilder<TFormValue, IsObject<TGroupValue[TOptions['path']]>>({
      path: path as string,
      label,
      fullPath,
      setValueToParent: (value) => {
        this.setFieldValue(path, value);

        set(this.formValue, fullPath, value);
      },
      formValue: this.formValue,
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
  setFieldValue(name: keyof TGroupValue, value: TGroupValue[typeof name]) {
    this.value = {
      ...this.value,
      [name]: value,
    };
    this.setValueToParent(this.value);
    this.onChangeHandler(this.value);

    /**
     * Root level, setValueToParent is not defined so update formValue here
     */
    if (!this.fullPath) {
      set(this.formValue, name, value);
    }
  }

  /**
   * Get Fields
   */
  getFields(): Array<RenderFormField<TFormValue, TGroupValue>> {
    return this.fields.map(({ showIf = () => true, ...item }): RenderFormField<TFormValue, TGroupValue> => {
      if (item.type === FormFieldType.GROUP) {
        return {
          ...item,
          path: item.group.path,
          label: item.group.label,
          group: item.group.getFields(),
          showIf: () => showIf(this.value, this.formValue),
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
        showIf: () => showIf(this.value, this.formValue),
        disableIf: () => disableIf(this.value, this.formValue),
        invalidIf: () => invalidIf(this.value, this.formValue),
        getErrorMessage: () => getErrorMessage(this.value, this.formValue),
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
  setValue(value: TGroupValue) {
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

  subscribeOnChange(handler: (value: TGroupValue) => void) {
    this.onChangeHandler = handler;

    return () => {
      this.onChangeHandler = () => null;
    };
  }
}
