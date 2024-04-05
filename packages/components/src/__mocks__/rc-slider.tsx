import React from 'react';

/**
 * Mock RC Slider
 */
const RcSlider: React.FC<any> = ({ onChange, ariaLabelForHandle, value, range = false }) => {
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
    />
  );
};

export default RcSlider;
