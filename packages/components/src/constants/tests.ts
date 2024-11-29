import { createSelector } from '@volkovlabs/jest-selectors';

/**
 * Test Identifiers
 */
export const TEST_IDS = {
  form: {
    root: createSelector((name: unknown) => `data-testid form-${name}`),
    sectionHeader: createSelector((name: unknown) => `data-testid form section-${name}`, 'headerDataTestId'),
    sectionContent: createSelector((name: unknown) => `data-testid form section-content-${name}`, 'contentDataTestId'),
    fieldSelect: createSelector((name: unknown) => `form field-select-${name}`),
    fieldCustom: createSelector((name: unknown) => `data-testid form field-custom-${name}`),
    fieldSlider: createSelector((name: unknown) => `data-testid form field-slider-${name}`),
    fieldRangeSlider: createSelector((name: unknown) => `form field-range-slider-${name}`, 'sliderAriaLabel'),
    fieldNumberInput: createSelector((name: unknown) => `data-testid form field-number-input-${name}`),
    fieldColor: createSelector((name: unknown) => `data-testid form field-color-${name}`),
    fieldInput: createSelector((name: unknown) => `data-testid form field-input-${name}`),
    /**
     * We should use default value for date-time-picker without data-testid prefix
     * https://github.com/grafana/grafana/blob/f43762f39abad43f99b85cbcff6ca30c56f9d75f/packages/grafana-ui/src/components/DateTimePickers/DateTimePicker/DateTimePicker.tsx#L249
     */
    fieldDatetime: createSelector(() => `data-testid date-time-input`),
    fieldRadio: createSelector((name: unknown) => `data-testid form field-radio-${name}`),
  },
  codeEditor: {
    copyButton: createSelector(() => `data-testid code-editor copy-button`),
    copyPasteText: createSelector(() => `data-testid code-editor copy-paste-text`),
    modal: createSelector(() => `data-testid code-editor modal-window`),
    miniMapButton: createSelector(() => `data-testid code-editor mini-map-button`),
    modalButton: createSelector((name: unknown) => `data-testid code-editor modal-button-${name}`),
    pasteButton: createSelector(() => `data-testid code-editor paste-button`),
    wrapButton: createSelector(() => `data-testid code-editor wrap-button`),
  },
  datasourceEditor: {
    fieldSelect: createSelector('data-testid datasource-editor field-select'),
  },
  payloadEditor: {
    loadingMessage: createSelector('data-testid payload-editor loading-message'),
    errorMessage: createSelector('data-testid payload-editor error-message'),
  },
};
