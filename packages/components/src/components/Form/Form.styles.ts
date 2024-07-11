import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    section: css`
      padding: ${theme.spacing(0, 0, 1, 1)};
    `,
    inlinePicker: css`
      padding: ${theme.spacing(1)} ${theme.spacing(0.5)};
      width: ${theme.spacing(3)};
    `,
  };
};
