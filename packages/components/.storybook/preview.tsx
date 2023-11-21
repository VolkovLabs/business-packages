import type { Preview } from '@storybook/react';
// @ts-ignore
import grafanaLightTheme from './grafana-10.2.1/grafana.light.scss';
// @ts-ignore
import grafanaDarkTheme from './grafana-10.2.1/grafana.dark.scss';
import { Light, Dark } from './theme';
import { withTheme } from './withTheme';

const handleThemeChange = (theme: any) => {
  if (theme !== 'light') {
    grafanaLightTheme.unuse();
    grafanaDarkTheme.use();
  } else {
    grafanaDarkTheme.unuse();
    grafanaLightTheme.use();
  }
};

const preview: Preview = {
  decorators: [withTheme(handleThemeChange)],
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
