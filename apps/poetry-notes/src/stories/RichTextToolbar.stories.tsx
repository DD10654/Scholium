import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { RichTextToolbar } from '../components/Editor/RichTextToolbar';

const meta: Meta<typeof RichTextToolbar> = {
  title: 'Editor/RichTextToolbar',
  component: RichTextToolbar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ background: '#0f0f1a', minHeight: '60px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof RichTextToolbar>;

function ToolbarWithEditor({
  italicActive = false,
  align = 'left',
}: {
  italicActive?: boolean;
  align?: 'left' | 'center' | 'right';
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['paragraph', 'heading'] }),
    ],
    content: italicActive
      ? `<p style="text-align:${align}"><em>Sample poem text</em></p>`
      : `<p style="text-align:${align}">Sample poem text</p>`,
    onCreate: ({ editor: e }) => {
      if (align !== 'left') e.commands.setTextAlign(align);
      if (italicActive) e.commands.setItalic();
    },
  });
  return <RichTextToolbar editor={editor} />;
}

export const Default: Story = {
  render: () => <ToolbarWithEditor />,
};

export const WithItalicActive: Story = {
  render: () => <ToolbarWithEditor italicActive />,
};

export const WithAlignCenter: Story = {
  render: () => <ToolbarWithEditor align="center" />,
};

export const WithAlignRight: Story = {
  render: () => <ToolbarWithEditor align="right" />,
};

export const NullEditor: Story = {
  args: { editor: null },
};
