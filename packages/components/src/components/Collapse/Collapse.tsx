import { cx } from '@emotion/css';
import { IconButton, useStyles2, useTheme2 } from '@grafana/ui';
import React from 'react';

import { getStyles } from './Collapse.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Title
   */
  title?: React.ReactElement | string;

  /**
   * Actions
   */
  actions?: React.ReactElement;

  /**
   * Children
   */
  children?: React.ReactElement | string;

  /**
   * Is Open?
   */
  isOpen?: boolean;

  /**
   * On Toggle
   */
  onToggle?: (isOpen: boolean) => void;

  /**
   * Header Test Id
   */
  headerTestId?: string;

  /**
   * Content Test Id
   */
  contentTestId?: string;

  /**
   * Fill
   */
  fill?: 'outline' | 'solid';

  /**
   * Is Inline Content
   */
  isInlineContent?: boolean;

  /**
   * Is toggle Button disabled
   */
  isTogglerDisabled?: boolean;
}

/**
 * Collapse
 */
export const Collapse: React.FC<Props> = ({
  title,
  actions,
  children,
  isOpen = false,
  onToggle,
  headerTestId,
  contentTestId,
  fill = 'outline',
  isInlineContent = false,
  isTogglerDisabled = false,
}) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  /**
   * Fill Options
   */
  const isSolid = fill === 'solid';
  const isOutline = fill === 'outline';

  return (
    <div
      className={cx({
        [styles.rootOutline]: isOutline,
      })}
    >
      <div
        className={cx(styles.header, {
          [styles.headerSolid]: isSolid,
        })}
        data-testid={headerTestId}
        onClick={() => onToggle?.(!isOpen)}
      >
        <IconButton
          name={isOpen ? 'angle-down' : 'angle-right'}
          tooltip={isOpen ? 'Collapse' : 'Expand'}
          className={styles.collapseIcon}
          disabled={isTogglerDisabled}
          aria-expanded={isOpen}
        />
        <div className={styles.title}>{title}</div>
        {actions && (
          <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>
      {isOpen && (
        <div style={{ padding: isInlineContent ? 0 : theme.spacing(0.5) }} data-testid={contentTestId}>
          {children}
        </div>
      )}
    </div>
  );
};
