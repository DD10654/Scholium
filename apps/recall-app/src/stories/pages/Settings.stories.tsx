import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import Settings from '@/pages/Settings';

const meta: Meta<typeof Settings> = {
  title: 'Pages/Settings',
  component: Settings,
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
type Story = StoryObj<typeof Settings>;

export const Default: Story = {};
