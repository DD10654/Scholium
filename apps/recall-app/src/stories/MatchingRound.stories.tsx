import type { Meta, StoryObj } from '@storybook/react';
import { MatchingRound } from '@/components/study/MatchingRound';

const ECON_CARDS = [
  { term: 'GDP', definition: 'The total monetary value of all goods and services produced in a country.' },
  { term: 'Inflation', definition: 'A general increase in prices and fall in the purchasing value of money.' },
  { term: 'Supply', definition: 'The total amount of a product or service available for purchase in a market.' },
  { term: 'Demand', definition: 'The consumer desire and willingness to pay for a specific good or service.' },
];

const meta: Meta<typeof MatchingRound> = {
  title: 'Study/MatchingRound',
  component: MatchingRound,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { onRoundComplete: () => {} },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof MatchingRound>;

export const Initial: Story = {
  args: { terms: ECON_CARDS },
};

export const TwoCards: Story = {
  args: {
    terms: [
      { term: 'GDP', definition: 'The total monetary value of all goods and services produced in a country.' },
      { term: 'Inflation', definition: 'A general increase in prices and fall in the purchasing value of money.' },
    ],
  },
};
