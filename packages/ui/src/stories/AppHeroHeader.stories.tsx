import type { Meta, StoryObj } from '@storybook/react';
import { AppHeroHeader } from '../AppHeroHeader';

const meta: Meta<typeof AppHeroHeader> = {
  title: 'Components/AppHeroHeader',
  component: AppHeroHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Recall Master',
    onSettings: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof AppHeroHeader>;

const SAMPLE_APPS = [
  { id: '1', title: 'Language Hub', url: 'http://localhost:8081', icon: '🗣️' },
  { id: '2', title: 'Poetry Notes', url: 'http://localhost:8082', icon: '📜' },
  { id: '3', title: 'Recall Master', url: 'http://localhost:8080', icon: '🧠' },
];

export const WithApps: Story = {
  args: { apps: SAMPLE_APPS },
};

export const ManyApps: Story = {
  args: {
    apps: [
      ...SAMPLE_APPS,
      { id: '4', title: 'Math Practice', url: 'http://localhost:8083', icon: '➕' },
      { id: '5', title: 'History Hub', url: 'http://localhost:8084', icon: '📚' },
      { id: '6', title: 'Science Lab', url: 'http://localhost:8085', icon: '🔬' },
    ],
  },
};

export const EmptyApps: Story = {
  args: { apps: [] },
};

export const NoApps: Story = {
  args: {},
};

export const WithSubtitle: Story = {
  args: {
    apps: SAMPLE_APPS,
    subtitle: 'Spaced repetition study tool',
  },
};

export const WithChildren: Story = {
  args: {
    apps: SAMPLE_APPS,
    subtitle: 'Welcome back, Alex',
  },
  render: (args) => (
    <AppHeroHeader {...args}>
      <button style={{ padding: '8px 20px', borderRadius: 8, background: '#3b67e3', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
        Start Studying →
      </button>
    </AppHeroHeader>
  ),
};
