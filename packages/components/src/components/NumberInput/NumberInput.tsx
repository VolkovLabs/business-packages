import { Input } from '@grafana/ui';
import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { roundValueBySteps } from '../../utils';

/**
 * Properties
 */
interface Props extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  /**
   * on Change
   * @param value
   */
  onChange?: (value: number) => void;

  /**
   * Value
   *
   * @type {number}
   */
  value: number | string;

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
   * Min
   *
   * @type {min}
   */
  min?: number;

  /**
   * Max
   *
   * @type {max}
   */
  max?: number;
}

/**
 * Number Input
 */
export const NumberInput: React.FC<Props> = ({ value, onChange, min, max, step, steps, ...restProps }) => {
  /**
   * Ref
   */
  const ref = useRef<HTMLInputElement>(null);
  const isChanged = useRef(false);

  /**
   * Local Value
   */
  const [localValue, setLocalValue] = useState(value?.toString() ?? '0');

  /**
   * On Change
   */
  const onChangeValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.currentTarget.value);
    isChanged.current = true;
  }, []);

  /**
   * On Save Value
   */
  const onSaveValue = useCallback(() => {
    let v = Number(localValue);

    if (Number.isNaN(v)) {
      v = 0;
    }

    if (step !== undefined) {
      /**
       * Round value by step
       */
      let availableValue = step * 1000;

      if (min !== undefined) {
        availableValue = min * 1000;
      }

      /**
       * Find nearest available value
       * Next available value will be taken if entered value between allowed range
       * 7 will be used for 6 entered value with 5,7 available values
       */
      while (availableValue < v * 1000) {
        availableValue += step * 1000;
      }

      v = availableValue / 1000;
    }

    if (max !== undefined && v > max) {
      v = max;
    } else if (min !== undefined && v < min) {
      v = min;
    }

    /**
     * Round value by steps
     */
    if (steps !== undefined) {
      v = roundValueBySteps(v, steps);
    }

    if (isChanged.current) {
      onChange?.(v);
      setLocalValue(v.toString());
      isChanged.current = false;
    }
  }, [localValue, max, min, onChange, step, steps]);

  /**
   * On Key Down
   */
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        ref.current?.blur();
      }
    },
    [onSaveValue]
  );

  /**
   * Update Local Value
   */
  useEffect(() => {
    setLocalValue(value?.toString() || '0');
  }, [value]);

  return (
    <Input
      ref={ref}
      {...restProps}
      type="text"
      value={localValue}
      onChange={onChangeValue}
      onBlur={onSaveValue}
      onKeyDown={onKeyDown}
    />
  );
};
