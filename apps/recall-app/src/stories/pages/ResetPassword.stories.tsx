import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '@/pages/ResetPassword';

const meta: Meta<typeof ResetPassword> = {
  title: 'Pages/ResetPassword',
  component: ResetPassword,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ResetPassword>;

export const Form: Story = {};
