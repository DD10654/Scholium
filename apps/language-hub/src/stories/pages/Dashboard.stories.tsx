import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';

const meta: Meta<typeof Index> = {
  title: 'Pages/Dashboard',
  component: Index,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Index>;

export const Default: Story = {};
