import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    details: css`
      padding: 0;
      margin: ${theme.spacing(1, 0, 0)};
      font-size: ${theme.typography.bodySmall.fontSize};
    `,
    detailsContent: css`
      padding: ${theme.spacing(1, 0)};
      font-size: ${theme.typography.bodySmall.fontSize};
    `,
  };
};
