import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import PracticeSection from '@/pages/PracticeSection';

const meta: Meta<typeof PracticeSection> = {
  title: 'Pages/PracticeSection',
  component: PracticeSection,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/practice/sec-1']}>
        <AppProvider>
          <Routes>
            <Route path="/practice/:sectionId" element={<Story />} />
          </Routes>
        </AppProvider>
      </MemoryRouter>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof PracticeSection>;

export const Default: Story = {};
