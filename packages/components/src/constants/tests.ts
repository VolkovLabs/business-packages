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
    fieldRadio: (name: unknown) => `data-testid form field-radio-${name}`,
  },
};
