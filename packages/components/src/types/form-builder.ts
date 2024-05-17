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
export interface BaseOptions<TObject extends object, TValue> {
  /**
   * Path
   *
   * @template TObject
   * @type {TObject}
   */
  path: keyof TObject;

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
  showIf?: (config: TObject) => boolean;

  /**
   * Disable If
   */
  disableIf?: (config: TObject) => boolean;

  /**
   * Invalid If
   */
  invalidIf?: (config: TObject) => boolean;

  /**
   * Get Error Message
   */
  getErrorMessage?: (config: TObject) => string;

  /**
   * View Options
   *
   * @type {string}
   */
  view?: ViewOptions;
}

export interface SelectOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {
  /**
   * Options
   */
  options: Array<SelectableValue<TValue>>;

  /**
   * Disable Options
   */
  disableOptions?: (config: TObject) => TValue[];

  /**
   * Settings
   */
  settings: Omit<
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

export interface RadioOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {
  /**
   * Options
   */
  options: Array<SelectableValue<TValue>>;

  /**
   * Disable Options
   */
  disableOptions?: (config: TObject) => TValue[];

  /**
   * Full Width
   *
   * @type {boolean}
   */
  fullWidth?: boolean;
}

export interface SliderOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {
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

export interface RangeSliderOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {
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

export interface CustomOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {
  /**
   * Component
   *
   * @type {React.FC}
   */
  editor: React.FC<{ value: TValue; onChange: (value: TValue) => void }>;
}

export interface ColorOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {}

export interface HiddenOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {}

export interface InputOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {
  /**
   * Placeholder
   *
   * @type {string}
   */
  placeholder?: string;
}

export interface NumberInputOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {
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
}

export interface DateTimePickerOptions<TObject extends object, TValue> extends BaseOptions<TObject, TValue> {
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

export interface GroupOptions<TObject extends object, TValue extends object> {
  /**
   * Path
   *
   * @template TObject
   * @type {TObject}
   */
  path: keyof TObject;

  /**
   * Group
   */
  group: FormBuilder<TValue>;

  /**
   * Show If
   */
  showIf?: (config: TObject) => boolean;
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
export type FormField<TObject extends object> =
  | ({
      type: FormFieldType.SELECT;
    } & SelectOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.RADIO;
    } & RadioOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.SLIDER;
    } & SliderOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.RANGE_SLIDER;
    } & RangeSliderOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.CUSTOM;
    } & CustomOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.COLOR;
    } & ColorOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.INPUT;
    } & InputOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.NUMBER_INPUT;
    } & NumberInputOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.DATETIME_PICKER;
    } & DateTimePickerOptions<TObject, TObject[keyof TObject]>)
  | ({
      type: FormFieldType.GROUP;
    } & GroupOptions<TObject, IsObject<TObject[keyof TObject]>>)
  | ({ type: FormFieldType.HIDDEN } & HiddenOptions<TObject, TObject[keyof TObject]>);

/**
 * Render Form Field
 */
export type RenderFormField<TObject extends object> =
  | ((
      | ({
          type: FormFieldType.SELECT;
          value: TObject[keyof TObject];
          onChange: (value: TObject[keyof TObject]) => void;
        } & SelectOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.RADIO;
          value: TObject[keyof TObject];
          onChange: (value: TObject[keyof TObject]) => void;
          disableOptions: () => Array<TObject[keyof TObject]>;
        } & RadioOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.SLIDER;
          value: number;
          onChange: (value: number) => void;
        } & SliderOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.RANGE_SLIDER;
          value: [number, number];
          onChange: (value: [number, number]) => void;
        } & RangeSliderOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.CUSTOM;
          value: TObject[keyof TObject];
          onChange: (value: TObject[keyof TObject]) => void;
        } & CustomOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.COLOR;
          value: string;
          onChange: (value: string) => void;
        } & ColorOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.HIDDEN;
          value: TObject[keyof TObject];
          onChange: (value: TObject[keyof TObject]) => void;
        } & HiddenOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.INPUT;
          value: string;
          onChange: (value: string) => void;
        } & InputOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.NUMBER_INPUT;
          value: number;
          onChange: (value: number) => void;
        } & NumberInputOptions<TObject, TObject[keyof TObject]>)
      | ({
          type: FormFieldType.DATETIME_PICKER;
          value: string;
          onChange: (value: string) => void;
        } & DateTimePickerOptions<TObject, TObject[keyof TObject]>)
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
      group: Array<RenderFormField<IsObject<TObject[keyof TObject]>>>;
      showIf: () => boolean;
      fullPath: string;
    };
