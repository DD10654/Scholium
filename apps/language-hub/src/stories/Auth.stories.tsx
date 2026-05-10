import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import Auth from '@/pages/Auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail } from 'lucide-react';

// Auth uses useNavigate, so it must be wrapped in a router.
// Supabase calls only fire on form submit, so all visual states
// are fully testable without a live connection.
const meta: Meta<typeof Auth> = {
  title: 'Pages/Auth',
  component: Auth,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Auth>;

// Default view — Login tab active
export const LoginTab: Story = {};

// To preview the Sign Up tab, Storybook controls can't switch Tabs state
// directly since it's internal to the page; navigate to the tab manually
// in the canvas. The remaining stories capture the post-submit states by
// rendering the page-level sub-views via Storybook's render override.
export const ConfirmationSent: Story = {
  render: () => {
    const email = 'student@example.com';
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="w-full max-w-md shadow-card animate-slide-up">
          <CardContent className="pt-8 pb-8 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-success mb-4" />
            <h2 className="text-2xl font-bold font-display mb-2">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a confirmation link to{' '}
              <span className="font-semibold text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account, then come back here to log in.
            </p>
            <Button variant="outline" className="mt-6">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const ResetLinkSent: Story = {
  render: () => {
    const email = 'student@example.com';
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="w-full max-w-md shadow-card animate-slide-up">
          <CardContent className="pt-8 pb-8 text-center">
            <Mail className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold font-display mb-2">Reset Link Sent</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to{' '}
              <span className="font-semibold text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in your email to set a new password.
            </p>
            <Button variant="outline" className="mt-6">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  },
};
