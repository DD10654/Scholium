import type { Meta, StoryObj } from '@storybook/react';
import { Pass2 } from '@/components/study/Pass2';

const ECON_CARDS = [
  { term: 'GDP', definition: 'The total monetary value of all goods and services produced in a country.' },
  { term: 'Inflation', definition: 'A general increase in prices and fall in the purchasing value of money.' },
  { term: 'Supply', definition: 'The total amount of a product or service available for purchase in a market.' },
  { term: 'Demand', definition: 'The consumer desire and willingness to pay for a specific good or service.' },
  { term: 'Elasticity', definition: 'The responsiveness of supply or demand to changes in price.' },
];

const meta: Meta<typeof Pass2> = {
  title: 'Study/Pass2',
  component: Pass2,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { onComplete: () => {} },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Pass2>;

export const QuestionDisplay: Story = {
  args: { cards: ECON_CARDS },
};

export const SingleCard: Story = {
  args: {
    cards: [
      { term: 'GDP', definition: 'The total monetary value of all goods and services produced in a country.' },
      { term: 'Inflation', definition: 'A general increase in prices and fall in the purchasing value of money.' },
      { term: 'Supply', definition: 'The total amount of a product or service available for purchase in a market.' },
      { term: 'Demand', definition: 'The consumer desire and willingness to pay for a specific good or service.' },
    ],
  },
};
