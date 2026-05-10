import type { Meta, StoryObj } from '@storybook/react';
import { SettingsLayout } from '../SettingsLayout';
import { SettingsCard } from '../SettingsCard';

const meta: Meta<typeof SettingsLayout> = {
  title: 'Components/SettingsLayout',
  component: SettingsLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onBack: () => {} },
};
export default meta;
type Story = StoryObj<typeof SettingsLayout>;

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const WithContent: Story = {
  render: (args) => (
    <SettingsLayout {...args}>
      <SettingsCard icon={<UserIcon />} title="Account" description="test@example.com" />
      <SettingsCard
        icon={<MoonIcon />}
        title="Dark Mode"
        description="Switch between light and dark themes."
        action={<button style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>Toggle</button>}
      />
    </SettingsLayout>
  ),
};

export const EmptyContent: Story = {
  render: (args) => <SettingsLayout {...args}>{null}</SettingsLayout>,
};

export const CustomTitle: Story = {
  args: { title: 'Account Settings' },
  render: (args) => (
    <SettingsLayout {...args}>
      <SettingsCard icon={<UserIcon />} title="Profile" description="Manage your account details." />
    </SettingsLayout>
  ),
};
