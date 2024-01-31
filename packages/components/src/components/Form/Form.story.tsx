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
      const form = useFormBuilder<{ opacity: number; custom: string; color: string; radio: string }>((builder) =>
        builder
          .addSlider({
            path: 'opacity',
            defaultValue: 100,
            min: 0,
            max: 100,
            label: 'Opacity',
            description: 'Opacity description',
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
      );

      return <Form {...args} fields={form.fields} value={form.value} />;
    };

    return (
      <div style={{ width: 200 }}>
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
