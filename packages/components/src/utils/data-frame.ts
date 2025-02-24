import { DataFrame, Field } from '@grafana/data';

/**
 * Find field
 */
export const findField = <TValue = unknown>(
  series: DataFrame[],
  predicateFn: (field: Field, frame: DataFrame) => boolean
): Field<TValue> | undefined => {
  for (let i = 0; i < series.length; i += 1) {
    const frame = series[i];

    const field = frame.fields.find((field) => predicateFn(field, frame));

    /**
     * Field found
     */
    if (field) {
      return field;
    }
  }

  return undefined;
};
