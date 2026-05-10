import type { Meta, StoryObj } from '@storybook/react';
import { CompletionScreen } from '@/components/study/CompletionScreen';

const meta: Meta<typeof CompletionScreen> = {
  title: 'Study/CompletionScreen',
  component: CompletionScreen,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onComplete: () => {} },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CompletionScreen>;

export const PerfectScore: Story = {
  args: { score: 10, total: 10 },
};

export const PartialScore: Story = {
  args: { score: 7, total: 10 },
};

export const LowScore: Story = {
  args: { score: 2, total: 10 },
};

export const NoScore: Story = {
  args: {},
};
