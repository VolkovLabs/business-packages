import { CodeEditor, IconButton, InlineField, InlineFieldRow, Modal, useStyles2 } from '@grafana/ui';
/**
 * Monaco
 */
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useCallback, useEffect, useState } from 'react';

import { CODE_EDITOR_CONFIG, TEST_IDS } from '../../constants';
import { getStyles } from './AutosizeCodeEditor.styles';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof CodeEditor> & {
  minHeight?: number;
  maxHeight?: number;
  modalTitle: string;
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
  modalButtonTooltip,
  onEditorDidMount,
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
  const [monacoEditor, setMonacoEditor] = useState<monacoType.editor.IStandaloneCodeEditor | null>(null);
  /**
   * Height
   */
  const [height, setHeight] = useState(getHeightByValue(value, minHeight, maxHeight));

  /**
   * Editor did mount handler
   */
  const onEditorDidMountMain = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
      setMonacoEditor(editor);
      if (onEditorDidMount) {
        onEditorDidMount(editor, monaco);
      }
    },
    [onEditorDidMount]
  );

  /**
   * Modal editor did mount handler
   */
  const modalEditorDidMount = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
      if (monacoEditor) {
        const positionsParams: monacoType.Position | null = monacoEditor?.getPosition();
        if (positionsParams) {
          editor.setPosition({ lineNumber: positionsParams.lineNumber, column: positionsParams.column });
          editor.focus();

          /**
           * Set timeout for correct scroll to line and place line in center of editor
           */
          setTimeout(() => {
            editor.revealLineInCenter(positionsParams.lineNumber);
          }, 0);
        }
      }
      if (onEditorDidMount) {
        onEditorDidMount(editor, monaco);
      }
    },
    [monacoEditor, onEditorDidMount]
  );

  /**
   * Update Height on value change
   */
  useEffect(() => {
    setHeight(getHeightByValue(value, minHeight, maxHeight));
  }, [value, minHeight, maxHeight]);

  return (
    <>
      <InlineFieldRow className={styles.line}>
        <InlineField className={styles.modalIconLine}>
          <IconButton
            tooltip={modalButtonTooltip}
            name="expand-arrows-alt"
            size="lg"
            onClick={() => setIsOpen(true)}
            {...TEST_IDS.codeEditor.modalButton.apply('modal-button')}
          />
        </InlineField>
      </InlineFieldRow>

      <CodeEditor
        value={value}
        onChange={(value) => {
          onChange?.(value);
          setHeight(getHeightByValue(value, minHeight, maxHeight));
        }}
        height={staticHeight ?? height}
        onEditorDidMount={onEditorDidMountMain}
        {...restProps}
      />

      <Modal
        title={modalTitle}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        className={styles.modal}
        contentClassName={styles.modalBody}
        closeOnEscape
        trapFocus
      >
        <div className={styles.content} {...TEST_IDS.codeEditor.modal.apply()}>
          <CodeEditor
            showMiniMap
            value={value}
            onChange={(value) => {
              onChange?.(value);
              setHeight(getHeightByValue(value, minHeight, maxHeight));
            }}
            containerStyles={styles.modalEditor}
            onEditorDidMount={modalEditorDidMount}
            {...restProps}
          />
        </div>
      </Modal>
    </>
  );
};
