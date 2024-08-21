import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    line: css`
      margin: 0 0;
      border: 1px solid ${theme.colors.border.medium};
      border-bottom: 0;
      background: ${theme.colors.background.secondary};
      padding: ${theme.spacing(0.5)};
    `,
    modal: css`
      width: 80%;
    `,
    content: css`
      padding: ${theme.spacing(1)};
    `,
    modalIconLine: css`
      margin: ${theme.spacing(0.5)} 0 0 ${theme.spacing(0.5)};
    `,
  };
};
