import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    line: css`
      margin-top: ${theme.spacing(1)};
    `,
    modal: css`
      width: 80%;
    `,
  };
};
