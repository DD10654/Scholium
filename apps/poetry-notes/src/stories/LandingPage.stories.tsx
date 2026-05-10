import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from '@storybook/test';
import { LandingPage } from '../components/LandingPage';
import { ProjectProvider } from '../contexts/ProjectContext';

const meta: Meta<typeof LandingPage> = {
  title: 'Pages/LandingPage',
  component: LandingPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <ProjectProvider>
        <Story />
      </ProjectProvider>
    ),
  ],
  args: {
    onProjectReady: () => {},
    onSettings: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof LandingPage>;

export const HomeView: Story = {};

export const OpenProjectsList: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const openBtn = canvas.queryByText(/open project/i) ?? canvas.queryByText(/continue/i);
    if (openBtn) await userEvent.click(openBtn);
  },
};

export const NewProjectFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const newBtn = canvas.queryByText(/new project/i);
    if (newBtn) await userEvent.click(newBtn);
  },
};
