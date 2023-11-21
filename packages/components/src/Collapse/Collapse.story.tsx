import { Button, Icon } from '@grafana/ui';
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
      defaultValue: 'Section',
    },
  },
  render: (args) => {
    const [{}, updateArgs] = useArgs();
    const onToggle = (isOpen: boolean) => updateArgs({ isOpen });

    return (
      <div style={{ width: 200 }}>
        <Collapse {...args} onToggle={onToggle} />
      </div>
    );
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
    children: <div>Content</div>,
  },
};

/**
 * Actions
 */
export const Actions: Story = {
  args: {
    isOpen: true,
    title: 'Section',
    actions: (
      <>
        <Button icon="trash-alt" variant="secondary" fill="text" size="sm" />
        <Icon name="draggabledots" />
      </>
    ),
    children: <div>Content</div>,
  },
};

/**
 * Solid
 */
export const Solid: Story = {
  args: {
    isOpen: true,
    title: 'Section',
    children: <div>Content</div>,
    fill: 'solid',
  },
};

/**
 * With Long Text
 */
export const LongTitle: Story = {
  args: {
    isOpen: true,
    title: 'Very long section title',
    actions: (
      <>
        <Button icon="trash-alt" variant="secondary" fill="text" size="sm" />
        <Icon name="draggabledots" />
      </>
    ),
    children: <div>Content</div>,
  },
};
