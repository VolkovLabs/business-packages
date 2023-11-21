import { useArgs } from '@storybook/client-api';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Collapse } from './Collapse';

/**
 * Story Meta
 */
const meta = {
  title: 'Collapse',
  component: Collapse,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      name: 'isOpen',
      type: 'boolean',
      defaultValue: false,
    },
    title: {
      name: 'title',
      type: 'string',
      defaultValue: 'Section',
    },
  },
  render: (args) => {
    const [{}, updateArgs] = useArgs();
    const onToggle = (isOpen: boolean) => updateArgs({ isOpen });

    return <Collapse {...args} onToggle={onToggle} />;
  },
} satisfies Meta<typeof Collapse>;

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
    isOpen: true,
    title: 'Section',
  },
};
