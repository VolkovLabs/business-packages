/**
 * Test Identifiers
 */
export const TEST_IDS = {
  form: {
    root: (name: unknown) => `data-testid form-${name}`,
    sectionHeader: (name: unknown) => `data-testid form section-${name}`,
    sectionContent: (name: unknown) => `data-testid form section-content-${name}`,
    fieldSelect: (name: unknown) => `form field-select-${name}`,
    fieldCustom: (name: unknown) => `data-testid form field-custom-${name}`,
    fieldSlider: (name: unknown) => `data-testid form field-slider-${name}`,
    fieldRangeSlider: (name: unknown) => `form field-range-slider-${name}`,
    fieldNumberInput: (name: unknown) => `data-testid form field-number-input-${name}`,
    fieldColor: (name: unknown) => `data-testid form field-color-${name}`,
    fieldInput: (name: unknown) => `data-testid form field-input-${name}`,
    /**
     * We should use default value for date-time-picker without data-testid prefix
     * https://github.com/grafana/grafana/blob/f43762f39abad43f99b85cbcff6ca30c56f9d75f/packages/grafana-ui/src/components/DateTimePickers/DateTimePicker/DateTimePicker.tsx#L249
     */
    fieldDatetime: () => `data-testid date-time-input`,
    fieldRadio: (name: unknown) => `data-testid form field-radio-${name}`,
  },
};
