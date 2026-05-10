import type { Meta, StoryObj } from '@storybook/react';
import { ScholiumLogo } from '../ScholiumLogo';

const meta: Meta<typeof ScholiumLogo> = {
  title: 'Brand/ScholiumLogo',
  component: ScholiumLogo,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof ScholiumLogo>;

export const Sm: Story = { args: { size: 'sm' } };
export const Md: Story = { args: { size: 'md' } };
export const Lg: Story = { args: { size: 'lg' } };
