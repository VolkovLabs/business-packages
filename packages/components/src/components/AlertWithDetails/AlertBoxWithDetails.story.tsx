import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { AlertWithDetails, AlertWithDetailsProps } from './AlertBoxWithDetails';

const variants: string[] = ['error', 'warning', 'info', 'success'];

const meta: Meta<typeof AlertWithDetails> = {
  title: 'AlertBoxWithDetails',
  component: AlertWithDetails,
  parameters: {
    controls: {
      exclude: ['onRemove'],
    },
  },
  args: {
    error: 'test',
    variant: 'error',
    title: 'Title',
    display: true,
  },
  argTypes: {
    error: { control: 'text' },
    title: { control: 'text' },
    children: { control: 'text' },
    variant: {
      control: { type: 'select', options: variants },
    },
  },
};

export const Basic: StoryFn<typeof AlertWithDetails> = ({ ...args }: AlertWithDetailsProps) => {
  return (
    <div>
      <AlertWithDetails {...args} />
    </div>
  );
};

export default meta;
