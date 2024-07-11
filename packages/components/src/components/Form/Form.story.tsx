import { useArgs } from '@storybook/client-api';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { useFormBuilder } from '../../hooks';
import { Form } from './Form';

/**
 * Story Meta
 */
const meta = {
  title: 'Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      name: 'name',
      type: 'string',
      defaultValue: 'form',
    },
    readonly: {
      name: 'readonly',
      type: 'boolean',
      defaultValue: false,
    },
  },
  render: (args) => {
    const [{}] = useArgs();

    const Preview = () => {
      const form = useFormBuilder<{
        group: {
          field: string;
          subGroup: {
            field: string;
          };
        };
        opacity: number;
        step: number;
        decimal: number;
        normalize: [number, number];
        custom: string;
        color: string;
        radio: string;
        groupField1: string;
        groupField2: string;
        datetime: string;
        multiSelect: string[];
      }>((builder) =>
        builder
          .addGroup(
            {
              path: 'group',
              label: 'Group',
            },
            (builder) =>
              builder
                .addInput({
                  path: 'field',
                  label: 'Field',
                  defaultValue: '',
                  view: {
                    grow: true,
                  },
                })
                .addGroup(
                  {
                    path: 'subGroup',
                    label: 'Sub Group',
                  },
                  (builder) =>
                    builder.addInput({
                      path: 'field',
                      label: 'Field',
                      defaultValue: '',
                      view: {
                        grow: true,
                      },
                    })
                )
          )
          .addSlider({
            path: 'opacity',
            defaultValue: 100,
            min: 0,
            max: 100,
            label: 'Opacity',
            description: 'Opacity description',
            view: {
              grow: true,
            },
          })
          .addSlider({
            path: 'step',
            defaultValue: 1,
            step: 2,
            min: 1,
            max: 9,
            marks: {
              1: '1',
              3: '3',
              5: '5',
              7: '7',
              9: '9',
            },
            label: 'Step',
            description: 'Move by 2 step',
            view: {
              grow: true,
            },
          })
          .addSlider({
            path: 'decimal',
            defaultValue: 1,
            step: 0.01,
            min: 1,
            max: 9,
            marks: {
              1: '1',
              3: '3',
              5: '5',
              7: '7',
              9: '9',
            },
            label: 'Decimal step',
            description: 'Move by 0.01 step',
            view: {
              grow: true,
            },
          })
          .addRangeSlider({
            path: 'normalize',
            defaultValue: [0, 255],
            min: 0,
            max: 255,
            label: 'Normalize',
            description: 'Normalize description',
            marks: { 0: '0', 100: '100' },
            view: {
              grow: true,
            },
          })
          .addColorPicker({
            path: 'color',
            defaultValue: 'red',
            label: 'Color',
          })
          .addCustom({
            path: 'custom',
            defaultValue: '',
            editor: ({
              value,
              onChange,
              disabled,
            }: {
              value: string;
              onChange: (value: string) => void;
              disabled?: boolean;
            }) => {
              return (
                <div>
                  Custom Field:{' '}
                  <input
                    style={{ border: '1px solid red' }}
                    value={value}
                    onChange={(event) => onChange(event.currentTarget.value)}
                    disabled={disabled}
                  />
                </div>
              );
            },
          })
          .addRadio({
            path: 'radio',
            defaultValue: '1',
            label: 'Radio',
            options: [
              {
                value: '1',
                label: 'Option 1',
              },
              {
                value: '2',
                label: 'Option 2',
              },
            ],
          })
          .addInput({
            path: 'groupField1',
            defaultValue: '',
            label: 'String Field',
            view: {
              grow: true,
              row: 'group',
              labelWidth: 12,
            },
          })
          .addInput({
            path: 'groupField2',
            defaultValue: '',
            label: 'Field 2',
            view: {
              grow: false,
              shrink: true,
              row: 'group',
            },
          })
          .addDateTimePicker({
            path: 'datetime',
            label: 'Datetime',
            defaultValue: new Date().toISOString(),
            min: new Date().toISOString(),
            showSeconds: false,
          })
          .addSelect({
            path: 'multiSelect',
            label: 'Multi Select',
            description: 'Multi and allow custom value',
            defaultValue: [],
            options: [],
            settings: {
              isMulti: true,
              allowCustomValue: true,
            },
          })
      );

      return <Form {...args} fields={form.fields} value={form.value} />;
    };

    return (
      <div style={{ width: 600, padding: '20px' }}>
        <Preview />
      </div>
    );
  },
} satisfies Meta<typeof Form>;

export default meta;

/**
 * Story
 */
type Story = StoryObj<typeof meta>;

/**
 * Default
 */
export const Default: Story = {
  args: {
    value: {},
    fields: [],
    name: 'default',
  },
};

/**
 * Inline
 */
export const Inline: Story = {
  args: {
    value: {},
    fields: [],
    variant: 'inline',
    name: 'inline',
  },
};

/**
 * Readonly
 */
export const Readonly: Story = {
  args: {
    value: {},
    fields: [],
    variant: 'inline',
    name: 'inline',
    readonly: true,
  },
};
