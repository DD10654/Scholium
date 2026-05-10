import type { Preview } from '@storybook/react-vite';
import '../src/tokens.css';
import '../src/AuthCard.css';
import '../src/AppHeroHeader.css';
import '../src/SettingsLayout.css';
import '../src/SettingsCard.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};
export default preview;
