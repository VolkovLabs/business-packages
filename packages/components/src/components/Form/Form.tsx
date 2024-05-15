import { dateTime } from '@grafana/data';
import {
  CollapsableSection,
  ColorPicker,
  DateTimePicker,
  Field,
  InlineField,
  InlineFieldRow,
  Input,
  RadioButtonGroup,
  Select,
  useStyles2,
} from '@grafana/ui';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { FormFieldType, RenderFormField } from '../../types';
import { NumberInput } from '../NumberInput';
import { RangeSlider } from '../RangeSlider';
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

  /**
   * Variant
   *
   * @type {'default' | 'inline'}
   */
  variant?: 'default' | 'inline';
}

/**
 * Form Control to prevent setting invalid to div element warning
 * @param className
 * @param children
 * @constructor
 */
const FormControl = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <div className={className}>{children}</div>
);

/**
 * Form
 */
export const Form = <TValue extends object>({
  name,
  expanded = {},
  onToggleExpanded = () => null,
  fields,
  variant = 'default',
  value,
}: Props<TValue>) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Group Fields In Rows
   * @param fields
   */
  const groupFieldsInRows = <TObject extends object>(fields: RenderFormField<TObject>[]) => {
    const rowsMap = fields.reduce(
      (acc, field, index) => {
        const rowKey = 'view' in field && field.view?.row ? `row_${field.view.row}` : index.toString();

        /**
         * Fields already in row
         */
        const rowValue = acc.get(rowKey) || [];

        /**
         * Add field to row
         */
        rowValue.push(field as RenderFormField<TObject>);
        acc.set(rowKey, rowValue);

        return acc;
      },
      new Map() as Map<string, RenderFormField<TObject>[]>
    );

    return Array.from(rowsMap.values());
  };

  /**
   * Render Field
   * @param field
   */
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
          {groupFieldsInRows(field.group).map((fields, index) =>
            fields.length > 1 && variant === 'inline' ? (
              <InlineFieldRow key={index}>{fields.map((field) => renderField(field))}</InlineFieldRow>
            ) : (
              fields.map((field) => renderField(field))
            )
          )}
        </CollapsableSection>
      );
    }

    /**
     * Field Component
     */
    const FieldComponent = variant === 'inline' ? InlineField : Field;

    /**
     * Field Props
     */
    let fieldProps: Record<string, unknown> = {
      label: field.label,
      description: field.description,
      key: field.fullPath,
      disabled: field.disableIf(),
      invalid: field.invalidIf(),
      error: field.getErrorMessage(),
    };

    /**
     * Inline field props
     */
    if (variant === 'inline') {
      fieldProps = {
        ...fieldProps,
        grow: field.view?.grow,
        shrink: field.view?.shrink,
        labelWidth: field.view?.labelWidth,
      };
    }

    if (field.type === FormFieldType.SELECT) {
      return (
        <FieldComponent {...fieldProps}>
          <Select
            value={field.value}
            options={field.options}
            onChange={(event) => {
              field.onChange(event.value ?? field.value);
            }}
            aria-label={TEST_IDS.form.fieldSelect(field.fullPath)}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.CUSTOM) {
      const Editor = field.editor;
      return (
        <FieldComponent {...fieldProps}>
          <Editor
            value={field.value}
            onChange={field.onChange}
            data-testid={TEST_IDS.form.fieldCustom(field.fullPath)}
            item={{
              settings: field.settings,
            }}
            context={{
              options: value as never,
            }}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.SLIDER) {
      return (
        <FieldComponent {...fieldProps}>
          <Slider
            value={field.value}
            onChange={field.onChange}
            min={field.min}
            max={field.max}
            step={field.step}
            marks={field.marks}
            data-testid={TEST_IDS.form.fieldSlider(field.fullPath)}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.RANGE_SLIDER) {
      return (
        <FieldComponent {...fieldProps}>
          <RangeSlider
            value={field.value}
            onChange={field.onChange}
            min={field.min}
            max={field.max}
            step={field.step}
            marks={field.marks}
            sliderAriaLabel={TEST_IDS.form.fieldRangeSlider(field.fullPath)}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.NUMBER_INPUT) {
      return (
        <FieldComponent {...fieldProps}>
          <NumberInput
            value={field.value}
            onChange={field.onChange}
            min={field.min}
            max={field.max}
            step={field.step}
            data-testid={TEST_IDS.form.fieldNumberInput(field.fullPath)}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.COLOR) {
      return (
        <FieldComponent {...fieldProps}>
          <FormControl className={styles.inlinePicker}>
            <ColorPicker
              color={field.value}
              onChange={field.onChange}
              data-testid={TEST_IDS.form.fieldColor(field.fullPath)}
            />
          </FormControl>
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.INPUT) {
      return (
        <FieldComponent {...fieldProps}>
          <Input
            value={field.value}
            onChange={(event) => {
              field.onChange(event.currentTarget.value);
            }}
            placeholder={field.placeholder}
            data-testid={TEST_IDS.form.fieldInput(field.fullPath)}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.DATETIME_PICKER) {
      return (
        <FieldComponent {...fieldProps}>
          <DateTimePicker
            minDate={field.min ? new Date(field.min) : undefined}
            maxDate={field.max ? new Date(field.max) : undefined}
            showSeconds={field.showSeconds}
            date={dateTime(field.value)}
            onChange={(value) => {
              field.onChange(value.toISOString());
            }}
            data-testid={TEST_IDS.form.fieldDatetime()}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.RADIO) {
      return (
        <FieldComponent {...fieldProps} data-testid={TEST_IDS.form.fieldRadio(field.fullPath)}>
          <RadioButtonGroup
            value={field.value}
            onChange={field.onChange}
            options={field.options}
            disabledOptions={field.disableOptions()}
            fullWidth={field.fullWidth}
          />
        </FieldComponent>
      );
    }

    return null;
  };

  return (
    <div data-testid={TEST_IDS.form.root(name)}>
      {groupFieldsInRows(fields).map((fields, index) =>
        fields.length > 1 && variant === 'inline' ? (
          <InlineFieldRow key={index}>{fields.map((field) => renderField(field))}</InlineFieldRow>
        ) : (
          fields.map((field) => renderField(field))
        )
      )}
    </div>
  );
};
