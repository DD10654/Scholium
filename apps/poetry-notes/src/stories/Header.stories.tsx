import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from '@storybook/test';
import { Header } from '../components/Layout/Header';
import { ProjectProvider } from '../contexts/ProjectContext';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <ProjectProvider>
        <Story />
      </ProjectProvider>
    ),
  ],
  args: { onBackToLanding: () => {} },
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const WithUnsavedChanges: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleEl = canvasElement.querySelector('[class*="title"]') as HTMLElement | null;
    if (titleEl) await userEvent.click(titleEl);
    const input = canvas.queryByRole('textbox');
    if (input) {
      await userEvent.clear(input);
      await userEvent.type(input, 'My Edited Project');
    }
  },
};

export const AtZoom150: Story = {
  play: async ({ canvasElement }) => {
    const zoomIn = canvasElement.querySelector('[aria-label="Zoom in"]') as HTMLButtonElement | null;
    if (zoomIn) {
      await userEvent.click(zoomIn);
      await userEvent.click(zoomIn);
      await userEvent.click(zoomIn);
      await userEvent.click(zoomIn);
      await userEvent.click(zoomIn);
    }
  },
};

export const AtZoom50: Story = {
  play: async ({ canvasElement }) => {
    const zoomOut = canvasElement.querySelector('[aria-label="Zoom out"]') as HTMLButtonElement | null;
    if (zoomOut) {
      await userEvent.click(zoomOut);
      await userEvent.click(zoomOut);
      await userEvent.click(zoomOut);
      await userEvent.click(zoomOut);
      await userEvent.click(zoomOut);
    }
  },
};
