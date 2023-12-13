import { ScopedVars, TimeRange, ScopedVar } from '@grafana/data';
import { VARIABLE_REGEX } from '../../constants';

import { getFieldAccessor } from './fieldAccessorCache';
import { formatVariableValue } from './formatVariableValue';
import { VariableCustomFormatterFn, VariableInterpolation } from '../types';

/**
 * Internal regex replace function
 */
type ReplaceFunction = (fullMatch: string, variableName: string, fieldPath: string, format: string) => string;

/**
 * Grafana template service which supports only replacing by scopedVars
 */
export class TemplateSrv {
  private _variables: any[];
  private regex = VARIABLE_REGEX;
  private index: any = {};
  private timeRange?: TimeRange | null = null;

  constructor() {
    this._variables = [];
  }

  init(variables: any, timeRange?: TimeRange) {
    this._variables = variables;
    this.timeRange = timeRange;
    this.updateIndex();
  }

  updateIndex() {
    const existsOrEmpty = (value: any) => value || value === '';

    this.index = this._variables.reduce((acc, currentValue) => {
      if (currentValue.current && (currentValue.current.isNone || existsOrEmpty(currentValue.current.value))) {
        acc[currentValue.name] = currentValue;
      }
      return acc;
    }, {});

    if (this.timeRange) {
      const from = this.timeRange.from.valueOf().toString();
      const to = this.timeRange.to.valueOf().toString();

      this.index = {
        ...this.index,
        ['__from']: {
          current: { value: from, text: from },
        },
        ['__to']: {
          current: { value: to, text: to },
        },
      };
    }
  }

  private getVariableValue(scopedVar: ScopedVar, fieldPath: string | undefined) {
    if (fieldPath) {
      return getFieldAccessor(fieldPath)(scopedVar.value);
    }

    return scopedVar.value;
  }

  private getVariableText(scopedVar: ScopedVar, value: any) {
    if (scopedVar.value === value || typeof value !== 'string') {
      return scopedVar.text;
    }

    return value;
  }

  replace(
    target: string,
    scopedVars: ScopedVars,
    format?: string | Function | undefined,
    interpolations?: VariableInterpolation[]
  ): string {
    if (!target) {
      return target ?? '';
    }

    this.regex.lastIndex = 0;

    return this._replaceWithVariableRegex(target, format, (match, variableName, fieldPath, fmt) => {
      const value = this._evaluateVariableExpression(match, variableName, fieldPath, fmt, scopedVars);

      // If we get passed this interpolations map we will also record all the expressions that were replaced
      if (interpolations) {
        interpolations.push({ match, variableName, fieldPath, format: fmt, value, found: value !== match });
      }

      return value;
    });
  }

  private _evaluateVariableExpression(
    match: string,
    variableName: string,
    fieldPath: string,
    format: string | VariableCustomFormatterFn | undefined,
    scopedVars: ScopedVars
  ) {
    const scopedVar = scopedVars?.[variableName];

    if (scopedVar) {
      const value = this.getVariableValue(scopedVar, fieldPath);
      const text = this.getVariableText(scopedVar, value);

      if (value !== null && value !== undefined) {
        return formatVariableValue(value, format, null, text);
      }
    }

    return match;
  }

  /**
   * Tries to unify the different variable format capture groups into a simpler replacer function
   */
  private _replaceWithVariableRegex(text: string, format: string | Function | undefined, replace: ReplaceFunction) {
    this.regex.lastIndex = 0;

    return text.replace(this.regex, (match, var1, var2, fmt2, var3, fieldPath, fmt3) => {
      const variableName = var1 || var2 || var3;
      const fmt = fmt2 || fmt3 || format;
      return replace(match, variableName, fieldPath, fmt);
    });
  }
}
