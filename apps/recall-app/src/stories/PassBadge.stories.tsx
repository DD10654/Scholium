import type { Meta, StoryObj } from '@storybook/react';
import { PassBadge } from '../components/PassBadge';

const meta: Meta<typeof PassBadge> = {
  title: 'Components/PassBadge',
  component: PassBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof PassBadge>;

export const Pass1: Story = { args: { pass: 1 } };
export const Pass2: Story = { args: { pass: 2 } };
export const Pass3: Story = { args: { pass: 3 } };
export const Pass4: Story = { args: { pass: 4 } };
