import { css, cx } from '@emotion/css';
import { Global } from '@emotion/react';
import { useTheme2 } from '@grafana/ui';
import React, { useCallback, useEffect, useState } from 'react';

import { NumberInput } from '../NumberInput';
import { getStyles } from './Slider.styles';
import { SliderProps } from './types';

/**
 * To make it working with grafana build
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: SliderComponent } = require('rc-slider');

/**
 * Properties
 */
interface Props extends Omit<SliderProps, 'ariaLabelForHandle'> {
  /**
   * Test ID
   *
   * @type {string}
   */
  ['data-testid']?: string;

  /**
   * Slider Aria Label
   *
   * @type {string}
   */
  sliderAriaLabel?: string;

  /**
   * Input Width
   *
   * @type {number}
   */
  inputWidth?: number;
}

/**
 * Slider
 */
export const Slider: React.FC<Props> = ({
  min,
  max,
  onChange,
  onAfterChange,
  orientation = 'horizontal',
  reverse,
  step,
  value,
  marks,
  included,
  inputWidth = 8,
  sliderAriaLabel,
  ...props
}) => {
  const isHorizontal = orientation === 'horizontal';
  const theme = useTheme2();
  const styles = getStyles(theme, isHorizontal, Boolean(marks));
  const SliderWithTooltip = SliderComponent;
  const [sliderValue, setSliderValue] = useState(value ?? min);

  const onSliderChange = useCallback(
    (v: number | number[]) => {
      const value = typeof v === 'number' ? v : v[0];

      setSliderValue(value);
      onChange?.(value);
    },
    [setSliderValue, onChange]
  );

  const onSliderInputChange = useCallback(
    (value: number) => {
      setSliderValue(value);

      if (onChange) {
        onChange(value);
      }

      if (onAfterChange) {
        onAfterChange(value);
      }
    },
    [onAfterChange, onChange]
  );

  const handleAfterChange = useCallback(
    (v: number | number[]) => {
      const value = typeof v === 'number' ? v : v[0];
      onAfterChange?.(value);
    },
    [onAfterChange]
  );

  useEffect(() => {
    if (value !== sliderValue) {
      setSliderValue(value ?? min);
    }
  }, [value, sliderValue, min]);

  const sliderInputClassNames = !isHorizontal ? [styles.sliderInputVertical] : [];
  const sliderInputFieldClassNames = !isHorizontal ? [styles.sliderInputFieldVertical] : [];

  return (
    <div className={cx(styles.container, styles.slider)}>
      {/** Slider tooltip's parent component is body and therefore we need Global component to do css overrides for it. */}
      <Global styles={styles.tooltip} />
      <div className={cx(styles.sliderInput, ...sliderInputClassNames)}>
        <SliderWithTooltip
          min={min}
          max={max}
          step={step}
          defaultValue={value}
          value={sliderValue}
          onChange={onSliderChange}
          onAfterChange={handleAfterChange}
          vertical={!isHorizontal}
          reverse={reverse}
          marks={marks}
          included={included}
          ariaLabelForHandle={sliderAriaLabel}
        />

        {inputWidth > 0 && (
          <NumberInput
            className={cx(
              styles.sliderInputField,
              ...sliderInputFieldClassNames,
              css`
                min-width: ${theme.spacing(inputWidth)};
                width: ${theme.spacing(inputWidth)};
              `
            )}
            value={sliderValue}
            onChange={onSliderInputChange}
            min={min}
            max={max}
            step={step}
            data-testid={props['data-testid']}
          />
        )}
      </div>
    </div>
  );
};

Slider.displayName = 'Slider';
