import { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import { AlertWithDetails, AlertWithDetailsProps } from './AlertWithDetails';

const variants: string[] = ['error', 'warning', 'info', 'success'];

const meta: Meta<typeof AlertWithDetails> = {
  title: 'AlertWithDetails',
  component: AlertWithDetails,
  parameters: {
    controls: {
      exclude: ['onRemove'],
    },
  },
  args: {
    details: '{{some json example}}',
    variant: 'error',
    title: 'Title',
    children: 'Some content',
  },
  argTypes: {
    details: { control: 'textarea' },
    title: { control: 'text' },
    children: { control: 'text' },
    variant: {
      control: { type: 'select', options: variants },
    },
  },
};

export const Basic: StoryFn<typeof AlertWithDetails> = ({ ...args }: AlertWithDetailsProps) => {
  const [show, setShow] = useState(true);
  return <div>{show && <AlertWithDetails {...args} onRemove={() => setShow(false)} />}</div>;
};

export default meta;
