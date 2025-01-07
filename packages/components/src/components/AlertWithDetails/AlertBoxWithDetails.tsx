import { Alert, useStyles2 } from '@grafana/ui';
import React, { ReactNode, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { CollapsableSection } from '../CollapsableSection';
import { getStyles } from './AlertBoxWithDetails.styles';

/**
 * Properties
 */
export type AlertWithDetailsProps = {
  error: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  title: string;
  onRemove?: (event: React.MouseEvent) => void;
  children?: ReactNode;
  display: boolean;
};

/**
 * Alert Box
 */
export const AlertWithDetails: React.FC<AlertWithDetailsProps> = ({
  children,
  error,
  variant,
  title,
  display,
  onRemove,
}) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [open, setOpen] = useState(false);

  const returnContent = () => {
    if (error) {
      return (
        <CollapsableSection
          className={styles.errorInfo}
          label="Details"
          isOpen={open}
          onToggle={() => setOpen(!open)}
          headerDataTestId={TEST_IDS.alertBox.sectionHeader.selector()}
          contentDataTestId={TEST_IDS.alertBox.sectionContent.selector()}
        >
          <div {...TEST_IDS.alertBox.details.apply()} className={styles.errorInfo}>
            {error}
          </div>
        </CollapsableSection>
      );
    }
    if (children) {
      return children;
    }
    return <></>;
  };

  return display ? (
    <Alert {...TEST_IDS.alertBox.root.apply()} severity={variant} title={title} onRemove={onRemove}>
      {returnContent()}
    </Alert>
  ) : (
    <></>
  );
};
