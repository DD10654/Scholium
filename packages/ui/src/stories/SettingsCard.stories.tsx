import type { Meta, StoryObj } from '@storybook/react';
import { SettingsCard } from '../SettingsCard';

const meta: Meta<typeof SettingsCard> = {
  title: 'Components/SettingsCard',
  component: SettingsCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SettingsCard>;

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

export const Default: Story = {
  args: {
    icon: <MoonIcon />,
    title: 'Dark Mode',
    variant: 'default',
  },
};

export const WithDescription: Story = {
  args: {
    icon: <MoonIcon />,
    title: 'Dark Mode',
    description: 'Switch between light and dark themes.',
    variant: 'default',
  },
};

export const WithAction: Story = {
  args: {
    icon: <MoonIcon />,
    title: 'Dark Mode',
    description: 'Switch between light and dark themes.',
    action: <button style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>Toggle</button>,
  },
};

export const WithChildren: Story = {
  args: {
    icon: <MoonIcon />,
    title: 'Theme',
    description: 'Choose your preferred display theme.',
  },
  render: (args) => (
    <SettingsCard {...args}>
      <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
        <button style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '2px solid #3b67e3', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Light</button>
        <button style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer' }}>Dark</button>
      </div>
    </SettingsCard>
  ),
};

export const DangerVariant: Story = {
  args: {
    icon: <TrashIcon />,
    title: 'Reset All Progress',
    description: 'Permanently delete all study progress. This cannot be undone.',
    variant: 'danger',
  },
};

export const DangerWithAction: Story = {
  args: {
    icon: <TrashIcon />,
    title: 'Reset All Progress',
    description: 'Permanently delete all study progress. This cannot be undone.',
    variant: 'danger',
    action: <button style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer' }}>Reset</button>,
  },
};
