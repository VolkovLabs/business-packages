import { VariableType } from '@grafana/data';
import { CustomVariableValue } from './variables/formatRegistry';

/**
 * Custom Formatter Variable
 */
export interface CustomFormatterVariable {
  name: string;
  type: VariableType;
  multi?: boolean;
  includeAll?: boolean;
}

/**
 * Variable Custom Formatter Function
 */
export type VariableCustomFormatterFn = (
  value: unknown,
  legacyVariableModel: Partial<CustomFormatterVariable>,
  legacyDefaultFormatter?: VariableCustomFormatterFn
) => unknown;

/**
 * Variable Value
 */
export type VariableValue = VariableValueSingle | VariableValueSingle[];

/**
 * Variable value string
 */
export type VariableValueSingle = string | boolean | number | CustomVariableValue;

/**
 * Slimmed down version of the SceneVariable interface so that it only contains what the formatters actually use.
 * This is useful as we have some implementations of this interface that does not need to be full scene objects.
 * For example ScopedVarsVariable and LegacyVariableWrapper.
 */
export interface FormatVariable {
  state: {
    name: string;
    type: VariableType | string;
    isMulti?: boolean;
    includeAll?: boolean;
  };

  getValue(fieldPath?: string): VariableValue | undefined | null;
  getValueText?(fieldPath?: string): string;
}

/**
 * Can be used to gain more information about an interpolation operation
 */
export interface VariableInterpolation {
  /** The full matched expression including, example: ${varName.field:regex} */
  match: string;
  /** In the expression ${varName.field:regex} variableName is varName */
  variableName: string;
  /** In the expression ${varName.fields[0].name:regex} the fieldPath is fields[0].name */
  fieldPath?: string;
  /** In the expression ${varName:regex} the regex part is the format */
  format?: string;
  /** The formatted value of the variable expresion. Will equal match when variable not found or scopedVar was undefined or null **/
  value: string;
  found?: boolean;
}
