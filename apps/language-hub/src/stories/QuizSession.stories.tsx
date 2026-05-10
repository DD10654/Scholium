import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { QuizSession, type QuizQuestion } from '@/components/QuizSession';

const FR_QUESTIONS: QuizQuestion[] = [
  { item: { id: '1', term: 'bonjour', definition: 'hello' }, type: 'fr-to-en', prompt: 'bonjour', answer: 'hello', language: 'french' },
  { item: { id: '2', term: 'merci', definition: 'thank you' }, type: 'fr-to-en', prompt: 'merci', answer: 'thank you', language: 'french' },
  { item: { id: '3', term: 'au revoir', definition: 'goodbye' }, type: 'en-to-fr', prompt: 'goodbye', answer: 'au revoir', language: 'french' },
  { item: { id: '4', term: 'chat', definition: 'cat' }, type: 'fr-to-en', prompt: 'chat', answer: 'cat', language: 'french' },
  { item: { id: '5', term: 'chien', definition: 'dog' }, type: 'dictation', prompt: 'chien', answer: 'chien', language: 'french' },
];

const mockFetch = () =>
  Promise.resolve(new Response(JSON.stringify({ audio: '' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

const meta: Meta<typeof QuizSession> = {
  title: 'Components/QuizSession',
  component: QuizSession,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    mockAddonConfigs: { globalMockData: [] },
  },
  decorators: [
    (Story) => {
      const orig = window.fetch;
      window.fetch = mockFetch as typeof window.fetch;
      setTimeout(() => { window.fetch = orig; }, 5000);
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
  args: {
    questions: FR_QUESTIONS,
    title: 'French Basics — Session 1',
    completionTitle: 'Session Complete!',
    completionSubtitle: 'Great work on your French vocabulary.',
    completionActions: <a href="/">Back to dashboard</a>,
    onCorrectAnswer: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof QuizSession>;

export const ActiveQuestion: Story = {};

export const SpanishQuestion: Story = {
  args: {
    questions: [
      { item: { id: '1', term: 'hola', definition: 'hello' }, type: 'fr-to-en', prompt: 'hola', answer: 'hello', language: 'spanish' },
      { item: { id: '2', term: 'gracias', definition: 'thank you' }, type: 'en-to-fr', prompt: 'thank you', answer: 'gracias', language: 'spanish' },
    ],
    title: 'Spanish Basics',
  },
};
