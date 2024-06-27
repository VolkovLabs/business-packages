import type { Preview } from '@storybook/react';
import type { GrafanaTheme2 } from '@grafana/data';

// @ts-ignore
import grafanaLightTheme from './grafana-11.1.0/grafana.light.scss';
// @ts-ignore
import grafanaDarkTheme from './grafana-11.1.0/grafana.dark.scss';
import { Light, Dark } from './theme';
import { withTheme } from './withTheme';

const handleThemeChange = (theme: GrafanaTheme2) => {
  if (theme.isDark) {
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
