import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from '@/components/PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: { placeholder: 'Enter password' },
};

export const WithValue: Story = {
  args: { value: 'mysecretpassword', readOnly: true },
};

export const Disabled: Story = {
  args: { placeholder: 'Enter password', disabled: true, value: 'disabled' },
};
