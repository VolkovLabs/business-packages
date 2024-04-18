import { useArgs } from '@storybook/client-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

import { NumberInput } from './NumberInput';

/**
 * Story Meta
 */
const meta = {
  title: 'Number Input',
  component: NumberInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
  argTypes: {
    value: {
      name: 'value',
      type: 'number',
      defaultValue: 0,
    },
    min: {
      name: 'min',
      type: 'number',
      defaultValue: undefined,
    },
    max: {
      name: 'max',
      type: 'number',
      defaultValue: undefined,
    },
    step: {
      name: 'step',
      type: 'number',
      defaultValue: undefined,
    },
  },
  render: (args) => {
    const [{}, updateArgs] = useArgs();
    const handleChange = (value: number) => {
      args.onChange?.(value);
      updateArgs({ value });
    };

    return <NumberInput {...args} onChange={handleChange} />;
  },
} satisfies Meta<typeof NumberInput>;

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
    value: 100,
  },
};

/**
 * Min Max
 */
export const MinMax: Story = {
  args: {
    value: 15,
    min: 10,
    max: 50,
  },
};

/**
 * Decimals
 */
export const Decimals: Story = {
  args: {
    value: 0.6,
    min: 0.3,
    max: 1.5,
    step: 0.2,
  },
};
