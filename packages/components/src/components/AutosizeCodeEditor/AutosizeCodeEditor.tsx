import { CodeEditor, Modal, useStyles2 } from '@grafana/ui';
/**
 * Monaco
 */
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useCallback, useEffect, useState } from 'react';

import { CODE_EDITOR_CONFIG, TEST_IDS } from '../../constants';
import { getStyles } from './AutosizeCodeEditor.styles';
import { Toolbar } from './Toolbar';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof CodeEditor> & {
  /**
   * Min height
   */
  minHeight?: number;

  /**
   * Max height
   */
  maxHeight?: number;

  /**
   * Should escape value
   */
  isEscaping?: boolean;
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
  onBlur,
  minHeight,
  maxHeight,
  height: staticHeight,
  onEditorDidMount,
  monacoOptions,
  showMiniMap,
  isEscaping = false,
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
  const [isShowMiniMap, setIsShowMiniMap] = useState(showMiniMap);
  const [currentMonacoOptions, setCurrentMonacoOptions] = useState(monacoOptions);
  const [monacoEditor, setMonacoEditor] = useState<monacoType.editor.IStandaloneCodeEditor | null>(null);
  const [monacoEditorModal, setMonacoEditorModal] = useState<monacoType.editor.IStandaloneCodeEditor | null>(null);

  /**
   * Height
   */
  const [height, setHeight] = useState(getHeightByValue(value, minHeight, maxHeight));

  /**
   * Set end of line to \n to all OS
   */
  const setEndLine = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType): void => {
      if (isEscaping) {
        const model = editor.getModel();
        model?.setEOL(monaco.editor.EndOfLineSequence.LF);
      }
    },
    [isEscaping]
  );

  /**
   * Editor did mount handler
   */
  const onEditorDidMountMain = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
      setEndLine(editor, monaco);
      setMonacoEditor(editor);
      if (onEditorDidMount) {
        onEditorDidMount(editor, monaco);
      }
    },
    [setEndLine, onEditorDidMount]
  );

  /**
   * Modal editor did mount handler
   */
  const modalEditorDidMount = useCallback(
    (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
      setEndLine(editor, monaco);
      setMonacoEditorModal(editor);
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
    [setEndLine, monacoEditor, onEditorDidMount]
  );

  /**
   * Change value
   */
  const onChangeValue = useCallback(
    (value: string) => {
      const currentValue = isEscaping ? value.replaceAll('\n', '\\n') : value;
      onChange?.(currentValue);
      setHeight(getHeightByValue(value, minHeight, maxHeight));
    },
    [maxHeight, minHeight, onChange, isEscaping]
  );

  /**
   * onBlur handler
   */
  const onBlurUpdate = useCallback(
    (value: string) => {
      const currentValue = isEscaping ? value.replaceAll('\n', '\\n') : value;
      onBlur?.(currentValue);
    },
    [onBlur, isEscaping]
  );

  /**
   * Update Height on value change
   */
  useEffect(() => {
    setHeight(getHeightByValue(value, minHeight, maxHeight));
  }, [value, minHeight, maxHeight]);

  return (
    <>
      <Toolbar
        editorValue={value}
        setIsOpen={setIsOpen}
        monacoEditor={monacoEditor}
        isShowMiniMap={isShowMiniMap}
        setIsShowMiniMap={setIsShowMiniMap}
        currentMonacoOptions={currentMonacoOptions}
        setCurrentMonacoOptions={setCurrentMonacoOptions}
      />
      <CodeEditor
        value={isEscaping ? value.replaceAll('\\n', '\n') : value}
        showMiniMap={isShowMiniMap}
        height={staticHeight ?? height}
        monacoOptions={currentMonacoOptions}
        onEditorDidMount={onEditorDidMountMain}
        onChange={onChangeValue}
        onBlur={onBlurUpdate}
        {...restProps}
      />

      <Modal
        title="Code editor"
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        className={styles.modal}
        contentClassName={styles.modalBody}
        closeOnEscape
        trapFocus
      >
        <div className={styles.content} {...TEST_IDS.codeEditor.modal.apply()}>
          <Toolbar
            isModal
            editorValue={value}
            setIsOpen={setIsOpen}
            isShowMiniMap={isShowMiniMap}
            monacoEditor={monacoEditorModal}
            setIsShowMiniMap={setIsShowMiniMap}
            currentMonacoOptions={currentMonacoOptions}
            setCurrentMonacoOptions={setCurrentMonacoOptions}
          />
          <CodeEditor
            value={isEscaping ? value.replaceAll('\\n', '\n') : value}
            showMiniMap={isShowMiniMap}
            containerStyles={styles.modalEditor}
            monacoOptions={currentMonacoOptions}
            onEditorDidMount={modalEditorDidMount}
            onChange={onChangeValue}
            onBlur={onBlurUpdate}
            {...restProps}
          />
        </div>
      </Modal>
    </>
  );
};
