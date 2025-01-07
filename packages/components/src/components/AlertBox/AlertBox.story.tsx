import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { AlertBox, AlertBoxProps } from './AlertBox';

const variants: string[] = ['error', 'warning', 'info', 'success'];

const meta: Meta<typeof AlertBox> = {
  title: 'AlertBox',
  component: AlertBox,
  parameters: {
    controls: {
      exclude: ['onRemove'],
    },
  },
  args: {
    error: 'test',
    variant: 'error',
    title: 'Title',
  },
  argTypes: {
    error: { control: 'text' },
    title: { control: 'text' },
    variant: {
      control: { type: 'select', options: variants },
    },
  },
};

export const Basic: StoryFn<typeof AlertBox> = ({ ...args }: AlertBoxProps) => {
  return (
    <div>
      <AlertBox {...args} />
    </div>
  );
};

export default meta;
