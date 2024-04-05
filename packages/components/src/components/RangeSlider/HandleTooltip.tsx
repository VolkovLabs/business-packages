import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import type { TooltipRef } from 'rc-tooltip';
import React, { useEffect, useRef } from 'react';

/**
 * To make it working with grafana build
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: Tooltip } = require('rc-tooltip');

export const HandleTooltip = (props: {
  value: number;
  children: React.ReactElement;
  visible: boolean;
  placement: 'bottom' | 'right';
  tipFormatter?: () => React.ReactNode;
}) => {
  const { value, children, visible, placement, tipFormatter, ...restProps } = props;

  const tooltipRef = useRef<TooltipRef>(null);
  const rafRef = useRef<number | null>(null);
  const styles = useStyles2(tooltipStyles);

  function cancelKeepAlign() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
  }

  function keepAlign() {
    rafRef.current = requestAnimationFrame(() => {
      tooltipRef.current?.forceAlign();
    });
  }

  useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      overlayClassName={styles.tooltip}
      placement={placement}
      overlay={tipFormatter ?? value}
      overlayInnerStyle={{ minHeight: 'auto' }}
      ref={tooltipRef}
      visible={visible}
      align={{
        offset: [0, 4],
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

const tooltipStyles = (theme: GrafanaTheme2) => {
  return {
    tooltip: css({
      position: 'absolute',
      display: 'block',
      visibility: 'visible',
      fontSize: theme.typography.bodySmall.fontSize,
      backgroundColor: theme.colors.background.primary,
      opacity: 0.9,
      /**
       * Should be higher to be visible in Drawers
       */
      zIndex: theme.zIndex.portal,
      padding: theme.spacing(0, 0.5),
    }),
  };
};
