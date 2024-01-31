import { CollapsableSection, ColorPicker, Field, Input, RadioButtonGroup, Select, useStyles2 } from '@grafana/ui';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { FormFieldType, RenderFormField } from '../../types';
import { NumberInput } from '../NumberInput';
import { Slider } from '../Slider';
import { getStyles } from './Form.styles';

/**
 * Properties
 */
interface Props<TValue extends object> {
  /**
   * Value
   */
  value: TValue;

  /**
   * Name
   *
   * @type {string}
   */
  name: string;

  /**
   * Expanded
   *
   * @type {Record<string, boolean>}
   */
  expanded?: Record<string, boolean>;

  /**
   * On Toggle Expanded
   */
  onToggleExpanded?: (expanded: Record<string, boolean>) => void;

  /**
   * Fields
   */
  fields: Array<RenderFormField<TValue>>;
}

/**
 * Form
 */
export const Form = <TValue extends object>({
  name,
  expanded = {},
  onToggleExpanded = () => null,
  fields,
}: Props<TValue>) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  const renderField = <TObject extends object>(field: RenderFormField<TObject>) => {
    if (!field.showIf()) {
      return null;
    }

    if (field.type === FormFieldType.GROUP) {
      return (
        <CollapsableSection
          key={field.fullPath}
          label={field.label}
          headerDataTestId={TEST_IDS.form.sectionHeader(field.fullPath)}
          contentDataTestId={TEST_IDS.form.sectionContent(field.fullPath)}
          contentClassName={styles.section}
          isOpen={expanded[field.path] ?? true}
          onToggle={(isOpen) =>
            onToggleExpanded({
              ...expanded,
              [field.path]: isOpen,
            })
          }
        >
          {field.group.map((field) => renderField(field))}
        </CollapsableSection>
      );
    }

    const fieldProps = {
      label: field.label,
      description: field.description,
      key: field.fullPath,
      disabled: field.disableIf(),
      invalid: field.invalidIf(),
      error: field.getErrorMessage(),
    };

    if (field.type === FormFieldType.SELECT) {
      return (
        <Field {...fieldProps}>
          <Select
            value={field.value}
            options={field.options}
            onChange={(event) => {
              field.onChange(event.value ?? field.value);
            }}
            aria-label={TEST_IDS.form.fieldSelect(field.fullPath)}
          />
        </Field>
      );
    }

    if (field.type === FormFieldType.CUSTOM) {
      const Editor = field.editor;
      return (
        <Field {...fieldProps}>
          <Editor
            value={field.value}
            onChange={field.onChange}
            data-testid={TEST_IDS.form.fieldCustom(field.fullPath)}
          />
        </Field>
      );
    }

    if (field.type === FormFieldType.SLIDER) {
      return (
        <Field {...fieldProps}>
          <Slider
            value={field.value}
            onChange={field.onChange}
            min={field.min}
            max={field.max}
            step={field.step}
            marks={field.marks}
            data-testid={TEST_IDS.form.fieldSlider(field.fullPath)}
          />
        </Field>
      );
    }

    if (field.type === FormFieldType.NUMBER_INPUT) {
      return (
        <Field {...fieldProps}>
          <NumberInput
            value={field.value}
            onChange={field.onChange}
            min={field.min}
            max={field.max}
            step={field.step}
            data-testid={TEST_IDS.form.fieldNumberInput(field.fullPath)}
          />
        </Field>
      );
    }

    if (field.type === FormFieldType.COLOR) {
      return (
        <Field {...fieldProps}>
          <div className={styles.inlinePicker}>
            <ColorPicker
              color={field.value}
              onChange={field.onChange}
              data-testid={TEST_IDS.form.fieldColor(field.fullPath)}
            />
          </div>
        </Field>
      );
    }

    if (field.type === FormFieldType.INPUT) {
      return (
        <Field {...fieldProps}>
          <Input
            value={field.value}
            onChange={(event) => {
              field.onChange(event.currentTarget.value);
            }}
            placeholder={field.placeholder}
            data-testid={TEST_IDS.form.fieldInput(field.fullPath)}
          />
        </Field>
      );
    }

    if (field.type === FormFieldType.RADIO) {
      return (
        <Field {...fieldProps} data-testid={TEST_IDS.form.fieldRadio(field.fullPath)}>
          <RadioButtonGroup
            value={field.value}
            onChange={field.onChange}
            options={field.options}
            disabledOptions={field.disableOptions()}
            fullWidth={field.fullWidth}
          />
        </Field>
      );
    }

    return null;
  };

  return <div data-testid={TEST_IDS.form.root(name)}>{fields.map((field) => renderField(field))}</div>;
};
