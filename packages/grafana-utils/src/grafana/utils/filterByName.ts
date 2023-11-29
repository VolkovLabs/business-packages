import { DataTransformContext, RegexpOrNamesMatcherOptions, MatcherConfig, FieldMatcherID } from '@grafana/data';

export const getMatcherConfig = (
  ctx: DataTransformContext,
  options?: RegexpOrNamesMatcherOptions,
  byVariable?: boolean
): MatcherConfig | undefined => {
  if (!options) {
    return undefined;
  }

  const { names, pattern, variable } = options;

  if (byVariable && variable) {
    const stringOfNames = ctx.interpolate(variable);
    if (/\{.*\}/.test(stringOfNames)) {
      const namesFromString = stringOfNames.slice(1).slice(0, -1).split(',');
      return { id: FieldMatcherID.byNames, options: { names: namesFromString } };
    }
    return { id: FieldMatcherID.byNames, options: { names: stringOfNames.split(',') } };
  }

  if ((!Array.isArray(names) || names.length === 0) && !pattern) {
    return undefined;
  }

  if (!pattern) {
    return { id: FieldMatcherID.byNames, options: { names } };
  }

  if (!Array.isArray(names) || names.length === 0) {
    return { id: FieldMatcherID.byRegexp, options: pattern };
  }

  return { id: FieldMatcherID.byRegexpOrNames, options };
};
