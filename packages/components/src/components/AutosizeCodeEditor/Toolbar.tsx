import {
  CodeEditorMonacoOptions,
  InlineField,
  InlineFieldRow,
  PageToolbar,
  ToolbarButton,
  useStyles2,
} from '@grafana/ui';
/**
 * Monaco
 */
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { getStyles } from './AutosizeCodeEditor.styles';
import { css, cx } from '@emotion/css';

/**
 * Properties
 */
type Props = {
  /**
   * Monaco Editor
   */
  monacoEditor: monacoType.editor.IStandaloneCodeEditor | null;

  /**
   * Open state
   */
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Modal Button tooltip
   *
   * @type {string}
   */
  modalButtonTooltip: string;

  /**
   * Value
   *
   * @type {string}
   */
  editorValue: string;

  /**
   * Modal state
   *
   * @type {boolean}
   */
  isModal?: boolean;

  /**
   * Monaco options
   *
   * @type {CodeEditorMonacoOptions}
   */
  currentMonacoOptions: CodeEditorMonacoOptions | undefined;

  /**
   * Set monaco options
   *
   * @type {React.Dispatch<React.SetStateAction<CodeEditorMonacoOptions | undefined>>}
   */
  setCurrentMonacoOptions: React.Dispatch<React.SetStateAction<CodeEditorMonacoOptions | undefined>>;
};

/**
 * Toolbar Code Editor
 */
export const Toolbar: React.FC<Props> = ({
  monacoEditor,
  setIsOpen,
  modalButtonTooltip,
  editorValue,
  isModal = false,
  setCurrentMonacoOptions,
  currentMonacoOptions,
}) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * State
   */
  const [copyPasteText, setCopyPasteText] = useState('');

  /**
   * Clear out status
   */
  useEffect(() => {
    if (copyPasteText) {
      setTimeout(() => {
        setCopyPasteText('');
      }, 1000);
    }
  }, [copyPasteText]);

  return (
    <PageToolbar
      buttonOverflowAlignment="right"
      className={styles.line}
      forceShowLeftItems={true}
      leftItems={[
        <ToolbarButton
          key="code-editor-button-modal"
          tooltip={modalButtonTooltip}
          icon={isModal ? 'compress-arrows' : 'expand-arrows-alt'}
          iconSize="lg"
          onClick={() => setIsOpen(isModal ? false : true)}
          {...TEST_IDS.codeEditor.modalButton.apply(isModal ? 'modal-close' : 'modal-open')}
        />,
      ]}
    >
      <InlineFieldRow className={styles.copyPasteSection}>
        <ToolbarButton
          className={styles.copyPasteIcon}
          tooltip="Copy code"
          icon="file-blank"
          iconSize="lg"
          onClick={() => {
            navigator.clipboard.writeText(editorValue).then(() => {
              setCopyPasteText('Copied!');
            });
          }}
          {...TEST_IDS.codeEditor.copyButton.apply()}
        />
        <ToolbarButton
          className={styles.copyPasteIcon}
          tooltip="Paste code"
          icon="file-alt"
          iconSize="lg"
          onClick={async () => {
            if (monacoEditor) {
              const selection: monacoType.Selection | null = monacoEditor.getSelection();

              const text = await navigator.clipboard.readText();

              const range = {
                startLineNumber: selection?.startLineNumber || 1,
                startColumn: selection?.startColumn || 1,
                endLineNumber: selection?.endLineNumber || 1,
                endColumn: selection?.endColumn || 1,
              };

              monacoEditor.executeEdits('clipboard', [
                {
                  range: range,
                  text: text,
                  forceMoveMarkers: false,
                },
              ]);
              monacoEditor.focus();
              setCopyPasteText('Pasted!');
            }
          }}
          {...TEST_IDS.codeEditor.pasteButton.apply()}
        />
        <InlineField
          className={cx(
            styles.copyPasteText,
            copyPasteText
              ? css`
                  width: 45px;
                `
              : css`
                  width: 10px;
                `
          )}
          {...TEST_IDS.codeEditor.copyPasteText.apply()}
        >
          <div className={cx(styles.text, copyPasteText ? styles.left : '')}>{copyPasteText}</div>
        </InlineField>
      </InlineFieldRow>
      <ToolbarButton
        tooltip="Wrap code on new lines"
        icon="wrap-text"
        iconSize="lg"
        onClick={() => {
          const wrapCode = currentMonacoOptions?.wordWrap === 'on' ? 'off' : 'on';
          setCurrentMonacoOptions({
            ...currentMonacoOptions,
            wordWrap: wrapCode,
          });
        }}
        {...TEST_IDS.codeEditor.wrapButton.apply()}
      />
    </PageToolbar>
  );
};
