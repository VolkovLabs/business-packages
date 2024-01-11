import { ScopedVars } from '@grafana/data';

import { GLOBAL_VARIABLES, VARIABLE_REGEX } from './constants';
import { TemplateSrv } from './grafana/templating/template_srv';
import { VariableCustomFormatterFn, VariableInterpolation } from './grafana/types';
import { VariableFormat } from './types';

/**
 * Template service
 */
class TemplateService {
  /**
   * Variable Regex
   */
  private regex = VARIABLE_REGEX;

  /**
   * Grafana Template Service
   */
  constructor(private readonly templateService: TemplateSrv) {}

  /**
   * Get variable names
   * @param expression
   * @private
   */
  private getVariableNames(expression: string): string[] {
    this.regex.lastIndex = 0;
    let match = undefined;
    const results: string[] = [];

    while ((match = this.regex.exec(expression))) {
      results.push(match[1] ?? match[4]);
    }

    if (!results.length) {
      return [];
    }

    return results;
  }

  /**
   * Contains variable
   * @param target
   * @param variableNames
   */
  public containsVariable(target?: string, variableNames: string[] = []): boolean {
    if (!target) {
      return false;
    }

    const names = this.getVariableNames(target);

    if (!names.length) {
      return false;
    }

    for (const name of names) {
      if (GLOBAL_VARIABLES.includes(name)) {
        return true;
      }
      if (variableNames.includes(name)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get used variable names
   * @param template
   * @param includeGlobal
   */
  public getUsedVariables(template: string, includeGlobal = false) {
    return this.getVariableNames(template).filter((variableName) =>
      includeGlobal ? true : !GLOBAL_VARIABLES.includes(variableName)
    );
  }

  /**
   * Replace Variables
   * @param target
   * @param scopedVars
   * @param format
   * @param interpolations
   */
  public replace(
    target: string,
    scopedVars: ScopedVars,
    format: VariableFormat | VariableCustomFormatterFn | undefined,
    interpolations?: VariableInterpolation[]
  ): string {
    if (!target) {
      return target ?? '';
    }

    return this.templateService.replace(target, scopedVars, format, interpolations);
  }
}

/**
 * Template service instance
 */
export const templateService = new TemplateService(new TemplateSrv());
