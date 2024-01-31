import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    section: css`
      padding: 0;
    `,
    inlinePicker: css`
      padding: ${theme.spacing(1)} ${theme.spacing(0.5)};
    `,
  };
};
