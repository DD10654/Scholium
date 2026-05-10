import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'accent', 'hero'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Click me' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Cancel' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Saved!' },
};

export const Accent: Story = {
  args: { variant: 'accent', children: 'Accent' },
};

export const Hero: Story = {
  args: { variant: 'hero', children: 'Get Started' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Large Button' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {(['default', 'destructive', 'outline', 'secondary', 'ghost', 'success', 'accent', 'hero'] as const).map(
        (variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        )
      )}
    </div>
  ),
};
