import { CodeEditor, IconButton, InlineField, Modal, useStyles2 } from '@grafana/ui';
import React, { useEffect, useState } from 'react';

import { CODE_EDITOR_CONFIG, TEST_IDS } from '../../constants';
import { getStyles } from './AutosizeCodeEditor.styles';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof CodeEditor> & {
  minHeight?: number;
  maxHeight?: number;
  modalTitle: string;
  modalHeight?: number;
  modalButtonTooltip: string;
};

/**
 * Get Height By Value
 * @param value
 * @param minHeight
 * @param maxHeight
 */
const getHeightByValue = (value: string, minHeight?: number, maxHeight?: number) => {
  const height = value.split('\n').length * CODE_EDITOR_CONFIG.lineHeight;

  const minCurrentHeight = minHeight || CODE_EDITOR_CONFIG.height.min;
  const maxCurrentHeight = maxHeight || CODE_EDITOR_CONFIG.height.max;

  if (height < minCurrentHeight) {
    return minCurrentHeight;
  }

  if (height > maxCurrentHeight) {
    return maxCurrentHeight;
  }

  return height;
};

/**
 * Autosize Code Editor
 * @constructor
 */
export const AutosizeCodeEditor: React.FC<Props> = ({
  value,
  onChange,
  minHeight,
  maxHeight,
  height: staticHeight,
  modalTitle,
  modalHeight,
  modalButtonTooltip,
  ...restProps
}) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * State
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Height
   */
  const [height, setHeight] = useState(getHeightByValue(value, minHeight, maxHeight));

  /**
   * Update Height on value change
   */
  useEffect(() => {
    setHeight(getHeightByValue(value, minHeight, maxHeight));
  }, [value, minHeight, maxHeight]);

  return (
    <>
      <InlineField className={styles.line}>
        <IconButton
          tooltip={modalButtonTooltip}
          name="gf-landscape"
          size="lg"
          onClick={() => setIsOpen(true)}
          {...TEST_IDS.codeEditor.modalButton.apply('modal-button')}
        />
      </InlineField>
      <CodeEditor
        value={value}
        onChange={(value) => {
          onChange?.(value);
          setHeight(getHeightByValue(value, minHeight, maxHeight));
        }}
        height={staticHeight ?? height}
        {...restProps}
      />
      <Modal title={modalTitle} isOpen={isOpen} onDismiss={() => setIsOpen(false)} className={styles.modal}>
        <div className={styles.content} {...TEST_IDS.codeEditor.modal.apply()}>
          <CodeEditor
            value={value}
            onChange={(value) => {
              onChange?.(value);
              setHeight(getHeightByValue(value, minHeight, maxHeight));
            }}
            height={modalHeight}
            {...restProps}
          />
        </div>
      </Modal>
    </>
  );
};
