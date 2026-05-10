import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { AccentButtons } from '@/components/AccentButtons';

function AccentButtonsDemo({ language, disabled }: { language?: string; disabled?: boolean }) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here and click an accent button..."
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 14 }}
      />
      <AccentButtons
        inputRef={inputRef}
        value={value}
        onChange={setValue}
        language={language}
        disabled={disabled}
      />
    </div>
  );
}

const meta: Meta = {
  title: 'Components/AccentButtons',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const FrenchAccents: StoryObj = {
  render: () => <AccentButtonsDemo />,
};

export const SpanishAccents: StoryObj = {
  render: () => <AccentButtonsDemo language="spanish" />,
};

export const Disabled: StoryObj = {
  render: () => <AccentButtonsDemo disabled />,
};

export const WithValue: StoryObj = {
  render: () => {
    function WithValueDemo() {
      const [value, setValue] = useState('bonjour');
      const inputRef = useRef<HTMLInputElement>(null);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 14 }}
          />
          <AccentButtons inputRef={inputRef} value={value} onChange={setValue} />
        </div>
      );
    }
    return <WithValueDemo />;
  },
};
