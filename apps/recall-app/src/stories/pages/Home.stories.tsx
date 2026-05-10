import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import Home from '@/pages/Home';

const meta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <AppProvider>
          <Story />
        </AppProvider>
      </MemoryRouter>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Home>;

export const Default: Story = {};
