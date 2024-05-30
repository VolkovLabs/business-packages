import React from 'react';

/**
 * Mock RC Slider
 */
const RcSlider: React.FC<any> = ({ onChange, ariaLabelForHandle, value, range = false, disabled }) => {
  return (
    <input
      type="number"
      onChange={(event) => {
        if (onChange) {
          onChange(range ? (event.target as any).values : Number(event.target.value));
        }
      }}
      aria-label={ariaLabelForHandle}
      value={range ? value[0] : value}
      disabled={disabled}
    />
  );
};

export default RcSlider;
