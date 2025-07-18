import { cx } from '@emotion/css';
import { Global } from '@emotion/react';
import { useTheme2 } from '@grafana/ui';
import type { SliderProps } from 'rc-slider';
import React, { useCallback, useEffect, useState } from 'react';

import { HandleTooltip } from './HandleTooltip';
import { getStyles } from './RangeSlider.styles';
import { RangeSliderProps } from './types';

/**
 * To make it working with grafana build
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: SliderComponent } = require('rc-slider');

/**
 * Properties
 */
interface Props extends Omit<RangeSliderProps, 'ariaLabelForHandle'> {
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
   * Disabled
   *
   * @type {boolean}
   */
  disabled?: boolean;
}

/**
 * Range Slider
 */
export const RangeSlider: React.FC<Props> = ({
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
  sliderAriaLabel,
  disabled,
  formatTooltipResult,
}) => {
  const isHorizontal = orientation === 'horizontal';
  const theme = useTheme2();
  const styles = getStyles(theme, isHorizontal, Boolean(marks));
  const SliderWithTooltip = SliderComponent;
  const [sliderValue, setSliderValue] = useState(value ?? [min, max]);

  const onSliderChange = useCallback(
    (value: number[]) => {
      setSliderValue(value);
      onChange?.([value[0], value[1]]);
    },
    [setSliderValue, onChange]
  );

  const handleAfterChange = useCallback(
    (value: number[]) => {
      onAfterChange?.([value[0], value[1]]);
    },
    [onAfterChange]
  );

  useEffect(() => {
    if (value !== sliderValue) {
      setSliderValue(value ?? [min, max]);
    }
  }, [value, sliderValue, min, max]);

  const sliderInputClassNames = !isHorizontal ? [styles.sliderInputVertical] : [];

  const tipHandleRender: SliderProps['handleRender'] = (node, handleProps) => {
    return (
      <HandleTooltip
        value={handleProps.value}
        visible={handleProps.dragging}
        tipFormatter={formatTooltipResult ? () => formatTooltipResult(handleProps.value) : undefined}
        placement={isHorizontal ? 'bottom' : 'right'}
      >
        {node}
      </HandleTooltip>
    );
  };

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
          onChangeComplete={handleAfterChange}
          vertical={!isHorizontal}
          reverse={reverse}
          marks={marks}
          included={included}
          ariaLabelForHandle={sliderAriaLabel}
          disabled={disabled}
          range={true}
          handleRender={tipHandleRender}
        />
      </div>
    </div>
  );
};

RangeSlider.displayName = 'RangeSlider';
