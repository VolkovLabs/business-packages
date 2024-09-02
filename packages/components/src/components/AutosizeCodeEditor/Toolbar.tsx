import { IconButton, InlineField, InlineFieldRow, useStyles2 } from '@grafana/ui';
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
  monacoEditor: monacoType.editor.IStandaloneCodeEditor | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalButtonTooltip: string;
  editorValue: string;
  isModal?: boolean;
};

/**
 * Autosize Code Editor
 * @constructor
 */
export const Toolbar: React.FC<Props> = ({
  monacoEditor,
  setIsOpen,
  modalButtonTooltip,
  editorValue,
  isModal = false,
}) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * State
   */
  const [copyPasteText, setCopyPasteText] = useState('');

  useEffect(() => {
    if (copyPasteText) {
      setTimeout(() => {
        setCopyPasteText('');
      }, 1000);
    }
  }, [copyPasteText]);

  return (
    <InlineFieldRow className={styles.line}>
      <InlineField className={styles.modalIconLine}>
        <IconButton
          tooltip={modalButtonTooltip}
          name={isModal ? 'compress-arrows' : 'expand-arrows-alt'}
          size="lg"
          onClick={() => setIsOpen(isModal ? false : true)}
          {...TEST_IDS.codeEditor.modalButton.apply(isModal ? 'modal-close' : 'modal-open')}
        />
      </InlineField>

      <InlineFieldRow className={styles.copyPasteSection}>
        <InlineField className={styles.copyPasteIcon}>
          <IconButton
            tooltip="Copy code"
            name="file-blank"
            size="lg"
            onClick={() => {
              navigator.clipboard.writeText(editorValue).then(() => {
                setCopyPasteText('Copied!');
              });
            }}
            {...TEST_IDS.codeEditor.copyButton.apply()}
          />
        </InlineField>
        <InlineField className={styles.copyPasteIcon}>
          <IconButton
            tooltip="Paste code"
            name="file-alt"
            size="lg"
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
                    forceMoveMarkers: true,
                  },
                ]);
                monacoEditor.focus();
                setCopyPasteText('Pasted!');
              }
            }}
            {...TEST_IDS.codeEditor.pasteButton.apply()}
          />
        </InlineField>
        <InlineField className={styles.copyPasteText} {...TEST_IDS.codeEditor.copyPasteText.apply()}>
          <>{copyPasteText}</>
        </InlineField>
      </InlineFieldRow>
    </InlineFieldRow>
  );
};
