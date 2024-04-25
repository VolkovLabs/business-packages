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
  },
  render: (args) => {
    const [{}] = useArgs();

    const Preview = () => {
      const form = useFormBuilder<{
        opacity: number;
        normalize: [number, number];
        custom: string;
        color: string;
        radio: string;
        groupField1: string;
        groupField2: string;
        datetime: string;
      }>((builder) =>
        builder
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
            editor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
              return (
                <div>
                  Custom Field:{' '}
                  <input
                    style={{ border: '1px solid red' }}
                    value={value}
                    onChange={(event) => onChange(event.currentTarget.value)}
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
