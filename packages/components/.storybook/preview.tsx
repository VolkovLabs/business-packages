import type { Preview } from '@storybook/react';
import { ThemeContext, createTheme } from '@grafana/data';
import { useDarkMode } from 'storybook-dark-mode';
import { Light, Dark } from './theme';

const preview: Preview = {
  decorators: [
    /**
     * Pass Context
     * @param Story
     */
    (Story) => {
      const theme = createTheme({ colors: { mode: useDarkMode() ? 'dark' : 'light' } });

      const css = `
        body {
          background: ${theme.colors.background.primary}
        }
      `;

      return (
        <ThemeContext.Provider value={theme}>
          <style>{css}</style>
          <Story />
        </ThemeContext.Provider>
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      dark: Dark,
      light: Light,
    },
  },
};

export default preview;
