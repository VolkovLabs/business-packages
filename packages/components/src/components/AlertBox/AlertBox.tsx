import { Alert, useStyles2 } from '@grafana/ui';
import React, { useState } from 'react';

import { getStyles } from './AlertBox.styles';
import { CollapsableSection } from '../CollapsableSection';
import { TEST_IDS } from '../../constants';

/**
 * Properties
 */
export type AlertBoxProps = {
  error: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  title: string;
  onRemove: (event: React.MouseEvent) => void;
};

/**
 * Alert Box
 */
export const AlertBox: React.FC<AlertBoxProps> = ({ error, variant, title, onRemove }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [open, setOpen] = useState(false);

  return error ? (
    <Alert {...TEST_IDS.alertBox.root.apply()} severity={variant} title={title} onRemove={onRemove}>
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
    </Alert>
  ) : (
    <></>
  );
};
