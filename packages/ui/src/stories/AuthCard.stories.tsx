import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { AuthCard } from '../AuthCard';

const meta: Meta<typeof AuthCard> = {
  title: 'Components/AuthCard',
  component: AuthCard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onSignIn: async () => null,
    onSignUp: async () => null,
    onForgotPassword: async () => null,
  },
};
export default meta;
type Story = StoryObj<typeof AuthCard>;

export const SignIn: Story = {};

export const SignInWithHint: Story = {
  args: { hint: 'Sign in to access your study materials.' },
};

export const SignUp: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Create an account'));
  },
};

export const ForgotPassword: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Forgot password?'));
  },
};

export const SignInError: Story = {
  args: {
    onSignIn: async () => 'Invalid email or password. Please try again.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByPlaceholderText('you@example.com'), 'test@example.com');
    await userEvent.type(canvas.getByPlaceholderText('••••••••'), 'wrongpassword');
    await userEvent.click(canvas.getByText('Sign in →'));
  },
};
