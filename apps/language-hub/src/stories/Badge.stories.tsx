import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'French' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Spanish' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Overdue' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'New' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Badge>French</Badge>
      <Badge variant="secondary">Spanish</Badge>
      <Badge variant="destructive">Overdue</Badge>
      <Badge variant="outline">New</Badge>
    </div>
  ),
};
