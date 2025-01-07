import { Alert, useStyles2 } from '@grafana/ui';
import React, { ReactNode, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { CollapsableSection } from '../CollapsableSection';
import { getStyles } from './AlertWithDetails.styles';

/**
 * Properties
 */
export type AlertWithDetailsProps = {
  details?: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  title: string;
  onRemove?: (event: React.MouseEvent) => void;
  children?: ReactNode;
};

/**
 * Alert With Details
 */
export const AlertWithDetails: React.FC<AlertWithDetailsProps> = ({ children, details, variant, title, onRemove }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [open, setOpen] = useState(false);

  return (
    <Alert {...TEST_IDS.alertWithDetails.root.apply()} severity={variant} title={title} onRemove={onRemove}>
      {children}
      {!!details && (
        <CollapsableSection
          className={styles.details}
          contentClassName={styles.detailsContent}
          label="Details"
          isOpen={open}
          onToggle={() => setOpen(!open)}
          headerDataTestId={TEST_IDS.alertWithDetails.detailsSectionHeader.selector()}
          contentDataTestId={TEST_IDS.alertWithDetails.detailsSectionContent.selector()}
        >
          {details}
        </CollapsableSection>
      )}
    </Alert>
  );
};
