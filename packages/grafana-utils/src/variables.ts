import { GLOBAL_VARIABLES } from './constants';

/*
 * This regex matches 3 types of variable reference with an optional format specifier
 * There are 6 capture groups that replace will return
 * \$(\w+)                                    $var1
 * \[\[(\w+?)(?::(\w+))?\]\]                  [[var2]] or [[var2:fmt2]]
 * \${(\w+)(?:\.([^:^\}]+))?(?::([^\}]+))?}   ${var3} or ${var3.fieldPath} or ${var3:fmt3} (or ${var3.fieldPath:fmt3} but that is not a separate capture group)
 */
const variableRegex = /\$(\w+)|\[\[(\w+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::([^\}]+))?}/g;

/**
 * Template service
 */
class TemplateService {
  /**
   * Get variable names
   * @param expression
   * @private
   */
  private getVariableNames(expression: string): string[] {
    variableRegex.lastIndex = 0;
    let match = undefined;
    const results: string[] = [];

    while ((match = variableRegex.exec(expression))) {
      results.push(match[1]);
    }

    if (!results.length) {
      return [];
    }
    return results;
  }

  /**
   * Contains template
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
        continue;
      }
      if (!variableNames.includes(name)) {
        return false;
      }
    }

    return true;
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
}

/**
 * Template service instance
 */
export const templateService = new TemplateService();
