import { dateTime, SelectableValue } from '@grafana/data';
import React from 'react';

const actual = jest.requireActual('@grafana/ui');

/**
 * Mock Color Picker
 */
const ColorPicker = jest.fn(({ onChange, color, ...props }) => {
  return (
    <input
      type="string"
      onChange={(event) => {
        if (onChange) {
          onChange(event.target.value);
        }
      }}
      data-testid={props['data-testid']}
      value={color}
    />
  );
});

/**
 * Mock Select component
 */
const Select = jest.fn(
  ({
    options,
    onChange,
    value,
    isMulti,
    isClearable,
    allowCustomValue,
    invalid,
    noOptionsMessage,
    formatOptionLabel,
    isLoading,
    ...restProps
  }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          if (isMulti) {
            const newOptions = allowCustomValue
              ? event.target.values.map((value: string) => ({
                  value,
                }))
              : options.filter((option: any) => event.target.values.includes(option.value));
            onChange(newOptions);
          } else {
            const plainOptions = options.reduce(
              (acc: SelectableValue[], option: SelectableValue) => acc.concat(option.options ? option.options : option),
              []
            );
            // eslint-disable-next-line eqeqeq
            onChange(plainOptions.find((option: any) => option.value == event.target.value));
          }
        }
      }}
      /**
       * Fix jest warnings because null value.
       * For Select component in @grafana/ui should be used null to reset value.
       */
      value={value === null ? '' : value?.value || value}
      multiple={isMulti}
      {...restProps}
    >
      {isClearable && (
        <option key="clear" value="">
          Clear
        </option>
      )}
      {(allowCustomValue
        ? value.map((value: string) => ({
            value,
            label: value,
          }))
        : options.reduce(
            (acc: SelectableValue[], option: SelectableValue) => acc.concat(option.options ? option.options : option),
            []
          )
      ).map(({ label, value }: any) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
);

/**
 * Mock DatetimePicker component
 */
const DateTimePicker = jest.fn(({ onChange, ...restProps }) => {
  return (
    <input
      data-testid={restProps['data-testid']}
      value={restProps.date.toISOString()}
      onChange={(event) => {
        if (onChange) {
          onChange(dateTime(event.target.value));
        }
      }}
    />
  );
});

module.exports = {
  ...actual,
  ColorPicker,
  Select,
  DateTimePicker,
};
