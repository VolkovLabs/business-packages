import { css, cx } from '@emotion/css';
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

  /**
   * Show mini map
   *
   * @type {boolean}
   */
  isShowMiniMap?: boolean;

  /**
   * Set show mini map
   *
   * @type {React.Dispatch<React.SetStateAction<boolean | undefined>>}
   */
  setIsShowMiniMap: React.Dispatch<React.SetStateAction<boolean | undefined>>;

  /**
   * Is read only mode
   *
   * @type {boolean}
   */
  readOnly?: boolean;
};

/**
 * Toolbar Code Editor
 */
export const Toolbar: React.FC<Props> = ({
  monacoEditor,
  setIsOpen,
  editorValue,
  isModal = false,
  setCurrentMonacoOptions,
  currentMonacoOptions,
  isShowMiniMap,
  setIsShowMiniMap,
  readOnly,
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
          tooltip={isModal ? 'Collapse code editor' : 'Expand code editor'}
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
          disabled={readOnly}
          className={styles.copyPasteIcon}
          tooltip={readOnly ? `Cannot edit in read-only mode` : `Paste code`}
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
        variant={currentMonacoOptions?.wordWrap === 'on' ? 'active' : 'default'}
        onClick={() => {
          const wrapCode = currentMonacoOptions?.wordWrap === 'on' ? 'off' : 'on';
          setCurrentMonacoOptions({
            ...currentMonacoOptions,
            wordWrap: wrapCode,
          });
        }}
        {...TEST_IDS.codeEditor.wrapButton.apply()}
      />
      {editorValue && editorValue.length > 100 && (
        <ToolbarButton
          tooltip={isShowMiniMap ? 'Hide mini map' : 'Show mini map'}
          icon="gf-movepane-right"
          iconSize="lg"
          variant={isShowMiniMap ? 'active' : 'default'}
          onClick={() => {
            setIsShowMiniMap((prev) => !prev);
          }}
          {...TEST_IDS.codeEditor.miniMapButton.apply()}
        />
      )}
    </PageToolbar>
  );
};
