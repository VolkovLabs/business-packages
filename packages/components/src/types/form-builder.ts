import { SelectableValue } from '@grafana/data';
import { SelectCommonProps } from '@grafana/ui';

import { FormBuilder } from '../utils';

/**
 * Is Object
 */
export type IsObject<T> = T extends object ? T : never;

/**
 * View Options
 */
interface ViewOptions {
  /**
   * Row
   * Allows to render several fields in a row
   * @type {string}
   */
  row?: string;

  /**
   * Grow
   *
   * @type {boolean}
   */
  grow?: boolean;

  /**
   * Shrink
   *
   * @type {boolean}
   */
  shrink?: boolean;

  /**
   * Label Width
   *
   * @type {number}
   */
  labelWidth?: number;
}

/**
 * Base Options
 */
export interface BaseOptions<TFormValue extends object, TGroupValue extends object, TValue> {
  /**
   * Path
   *
   * @template TObject
   * @type {TObject}
   */
  path: keyof TGroupValue;

  /**
   * Default Value
   * @template TValue
   * @type {TValue}
   */
  defaultValue: TValue;

  /**
   * Label
   *
   * @type {string}
   */
  label?: string;

  /**
   * Description
   *
   * @type {string}
   */
  description?: string;

  /**
   * Show If
   */
  showIf?: (config: TGroupValue, formConfig: TFormValue) => boolean;

  /**
   * Disable If
   */
  disableIf?: (config: TGroupValue, formConfig: TFormValue) => boolean;

  /**
   * Invalid If
   */
  invalidIf?: (config: TGroupValue, formConfig: TFormValue) => boolean;

  /**
   * Get Error Message
   */
  getErrorMessage?: (config: TGroupValue, formConfig: TFormValue) => string;

  /**
   * View Options
   *
   * @type {string}
   */
  view?: ViewOptions;
}

export interface SelectOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {
  /**
   * Options
   */
  options: Array<SelectableValue<TValue>>;

  /**
   * Disable Options
   */
  disableOptions?: (config: TGroupValue) => TValue[];

  /**
   * Settings
   */
  settings?: Omit<
    SelectCommonProps<TValue>,
    | 'aria-label'
    | 'data-testid'
    | 'onBlur'
    | 'onChange'
    | 'onCloseMenu'
    | 'onInputChange'
    | 'onKeyDown'
    | 'onMenuScrollToBottom'
    | 'onMenuScrollToTop'
    | 'onOpenMenu'
    | 'onFocus'
    | 'options'
  >;
}

export interface RadioOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {
  /**
   * Options
   */
  options: Array<SelectableValue<TValue>>;

  /**
   * Disable Options
   */
  disableOptions?: (config: TGroupValue) => TValue[];

  /**
   * Full Width
   *
   * @type {boolean}
   */
  fullWidth?: boolean;
}

export interface SliderOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {
  /**
   * Min
   *
   * @type {number}
   */
  min: number;

  /**
   * Max
   *
   * @type {number}
   */
  max: number;

  /**
   * Step
   *
   * @type {number}
   */
  step?: number;

  /**
   * Steps
   *
   * @type {number[]}
   */
  steps?: number[];

  /**
   * Marks
   *
   * @type {Record<string, string>}
   */
  marks?: Record<string, string>;
}

export interface RangeSliderOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {
  /**
   * Min
   *
   * @type {number}
   */
  min: number;

  /**
   * Max
   *
   * @type {number}
   */
  max: number;

  /**
   * Step
   *
   * @type {number}
   */
  step?: number;

  /**
   * Marks
   *
   * @type {Record<string, string>}
   */
  marks?: Record<string, string>;
}

export interface StandardEditorProps<TValue> {
  /**
   * Value
   */
  value: TValue;

  /**
   * On Change
   * @param value
   */
  onChange: (value: TValue) => void;

  /**
   * Disabled
   *
   * @type {boolean}
   */
  disabled?: boolean;
}

export interface CustomOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {
  /**
   * Component
   *
   * @type {React.FC}
   */
  editor: React.FC<{ value: TValue; onChange: (value: TValue) => void; disabled?: boolean }>;
}

export interface ColorOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {}

export interface HiddenOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {}

export interface InputOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {
  /**
   * Placeholder
   *
   * @type {string}
   */
  placeholder?: string;
}

export interface NumberInputOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {
  /**
   * Min
   *
   * @type {number}
   */
  min?: number;

  /**
   * Max
   *
   * @type {number}
   */
  max?: number;

  /**
   * Step
   *
   * @type {number}
   */
  step?: number;

  /**
   * Steps
   *
   * @type {number[]}
   */
  steps?: number[];
}

export interface DateTimePickerOptions<TFormValue extends object, TGroupValue extends object, TValue>
  extends BaseOptions<TFormValue, TGroupValue, TValue> {
  /**
   * Min
   *
   * @type {string}
   */
  min?: string;

  /**
   * Max
   *
   * @type {string}
   */
  max?: string;

  /**
   * Show seconds
   *
   * @type {boolean}
   */
  showSeconds?: boolean;
}

export interface GroupOptions<TFormValue extends object, TGroupValue extends object, TValue extends object> {
  /**
   * Path
   *
   * @template TObject
   * @type {TObject}
   */
  path: keyof TGroupValue;

  /**
   * Group
   */
  group: FormBuilder<TFormValue, TValue>;

  /**
   * Show If
   */
  showIf?: (config: TGroupValue, formConfig: TFormValue) => boolean;
}

/**
 * Form Field Type
 */
export enum FormFieldType {
  SELECT = 'select',
  SLIDER = 'slider',
  GROUP = 'group',
  CUSTOM = 'custom',
  COLOR = 'color',
  RADIO = 'radio',
  HIDDEN = 'hidden',
  INPUT = 'input',
  NUMBER_INPUT = 'numberInput',
  RANGE_SLIDER = 'rangeSlider',
  DATETIME_PICKER = 'datetimePicker',
}

/**
 * Form Field
 */
export type FormField<TFormValue extends object, TGroupValue extends object> =
  | ({
      type: FormFieldType.SELECT;
    } & SelectOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.RADIO;
    } & RadioOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.SLIDER;
    } & SliderOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.RANGE_SLIDER;
    } & RangeSliderOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.CUSTOM;
    } & CustomOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.COLOR;
    } & ColorOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.INPUT;
    } & InputOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.NUMBER_INPUT;
    } & NumberInputOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.DATETIME_PICKER;
    } & DateTimePickerOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
  | ({
      type: FormFieldType.GROUP;
    } & GroupOptions<TFormValue, TGroupValue, IsObject<TGroupValue[keyof TGroupValue]>>)
  | ({ type: FormFieldType.HIDDEN } & HiddenOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>);

/**
 * Render Form Field
 */
export type RenderFormField<TFormValue extends object, TGroupValue extends object = TFormValue> =
  | ((
      | ({
          type: FormFieldType.SELECT;
          value: TGroupValue[keyof TGroupValue];
          onChange: (value: TGroupValue[keyof TGroupValue]) => void;
        } & SelectOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.RADIO;
          value: TGroupValue[keyof TGroupValue];
          onChange: (value: TGroupValue[keyof TGroupValue]) => void;
          disableOptions: () => Array<TGroupValue[keyof TGroupValue]>;
        } & RadioOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.SLIDER;
          value: number;
          onChange: (value: number) => void;
        } & SliderOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.RANGE_SLIDER;
          value: [number, number];
          onChange: (value: [number, number]) => void;
        } & RangeSliderOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.CUSTOM;
          value: TGroupValue[keyof TGroupValue];
          onChange: (value: TGroupValue[keyof TGroupValue]) => void;
        } & CustomOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.COLOR;
          value: string;
          onChange: (value: string) => void;
        } & ColorOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.HIDDEN;
          value: TGroupValue[keyof TGroupValue];
          onChange: (value: TGroupValue[keyof TGroupValue]) => void;
        } & HiddenOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.INPUT;
          value: string;
          onChange: (value: string) => void;
        } & InputOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.NUMBER_INPUT;
          value: number;
          onChange: (value: number) => void;
        } & NumberInputOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
      | ({
          type: FormFieldType.DATETIME_PICKER;
          value: string;
          onChange: (value: string) => void;
        } & DateTimePickerOptions<TFormValue, TGroupValue, TGroupValue[keyof TGroupValue]>)
    ) & {
      showIf: () => boolean;
      disableIf: () => boolean;
      invalidIf: () => boolean;
      getErrorMessage: () => string;
      fullPath: string;
      view?: ViewOptions;
    })
  | {
      type: FormFieldType.GROUP;
      path: string;
      label: string;
      group: Array<RenderFormField<TFormValue, IsObject<TGroupValue[keyof TGroupValue]>>>;
      showIf: () => boolean;
      fullPath: string;
    };
