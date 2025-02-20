import { dateTime, dateTimeFormat } from '@grafana/data';
import {
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
import { CollapsableSection } from '../CollapsableSection';
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
  onToggleExpanded?: (expanded: Record<string, boolean>, event: { path: string; expanded: boolean }) => void;

  /**
   * Fields
   */
  fields: Array<RenderFormField<TValue, TValue>>;

  /**
   * Variant
   *
   * @type {'default' | 'inline'}
   */
  variant?: 'default' | 'inline';

  /**
   * Readonly
   *
   * @type {boolean}
   */
  readonly?: boolean;
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
export const Form = <TFormValue extends object>({
  name,
  expanded = {},
  onToggleExpanded = () => null,
  fields,
  variant = 'default',
  readonly = false,
}: Props<TFormValue>) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Group Fields In Rows
   * @param fields
   */
  const groupFieldsInRows = <TGroupValue extends object>(fields: RenderFormField<TFormValue, TGroupValue>[]) => {
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
        rowValue.push(field as RenderFormField<TFormValue, TGroupValue>);
        acc.set(rowKey, rowValue);

        return acc;
      },
      new Map() as Map<string, RenderFormField<TFormValue, TGroupValue>[]>
    );

    return Array.from(rowsMap.values());
  };

  /**
   * Render Field
   * @param field
   */
  const renderField = <TGroupValue extends object>(field: RenderFormField<TFormValue, TGroupValue>) => {
    if (!field.showIf()) {
      return null;
    }

    if (field.type === FormFieldType.GROUP) {
      return (
        <CollapsableSection
          key={field.fullPath}
          label={field.label}
          {...TEST_IDS.form.sectionHeader.apply(field.fullPath)}
          {...TEST_IDS.form.sectionContent.apply(field.fullPath)}
          contentClassName={styles.section}
          isOpen={expanded[field.fullPath] ?? true}
          onToggle={(isOpen) =>
            onToggleExpanded(
              {
                ...expanded,
                [field.fullPath]: isOpen,
              },
              { path: field.fullPath, expanded: isOpen }
            )
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
      disabled: field.disableIf() || readonly,
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
              if (field.settings?.isMulti) {
                field.onChange((Array.isArray(event) ? event.map((s) => s.value) : [event.value ?? '']) as never);
              } else {
                field.onChange(event.value ?? field.value);
              }
            }}
            {...field.settings}
            {...TEST_IDS.form.fieldSelect.apply(field.fullPath)}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.CUSTOM) {
      const Editor = field.editor;
      return (
        <FieldComponent {...fieldProps}>
          <Editor value={field.value} onChange={field.onChange} {...TEST_IDS.form.fieldCustom.apply(field.fullPath)} />
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
            {...TEST_IDS.form.fieldSlider.apply(field.fullPath)}
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
            {...TEST_IDS.form.fieldRangeSlider.apply(field.fullPath)}
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
            {...TEST_IDS.form.fieldNumberInput.apply(field.fullPath)}
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
              onChange={(color) => {
                if (!fieldProps.disabled) {
                  field.onChange(color);
                }
              }}
              {...TEST_IDS.form.fieldColor.apply(field.fullPath)}
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
            {...TEST_IDS.form.fieldInput.apply(field.fullPath)}
          />
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.DATETIME_PICKER) {
      const format = field.showSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
      return (
        <FieldComponent {...fieldProps}>
          {fieldProps.disabled ? (
            <Input value={dateTimeFormat(dateTime(field.value), { format })} {...TEST_IDS.form.fieldDatetime.apply()} />
          ) : (
            <DateTimePicker
              minDate={field.min ? new Date(field.min) : undefined}
              maxDate={field.max ? new Date(field.max) : undefined}
              showSeconds={field.showSeconds}
              date={dateTime(field.value)}
              onChange={(value) => {
                if (value) {
                  field.onChange(value.toISOString());
                }
              }}
              {...TEST_IDS.form.fieldDatetime.apply()}
            />
          )}
        </FieldComponent>
      );
    }

    if (field.type === FormFieldType.RADIO) {
      return (
        <FieldComponent {...fieldProps} {...TEST_IDS.form.fieldRadio.apply(field.fullPath)}>
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
    <div {...TEST_IDS.form.root.apply(name)}>
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
