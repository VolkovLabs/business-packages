import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';

/**
 * Code Parameter Group
 */
interface CodeParameterGroup {
  /**
   * Detail
   *
   * @type {string}
   */
  detail: string;

  /**
   * Items
   */
  items: Record<string, CodeParameterGroup | CodeParameterItem>;
}

/**
 * Parameter Item
 */
export class CodeParameterItem<TValue = unknown> {
  /**
   * Specify for type validation
   */
  value: TValue = {} as TValue;

  constructor(
    public detail: string,
    public kind: CodeEditorSuggestionItemKind = CodeEditorSuggestionItemKind.Property
  ) {}
}

/**
 * Convert group to payload object
 */
type PayloadForGroup<TGroup extends CodeParameterGroup> = {
  [Key in keyof TGroup['items']]: TGroup['items'][Key] extends CodeParameterGroup
    ? PayloadForGroup<TGroup['items'][Key]>
    : TGroup['items'][Key] extends CodeParameterItem
      ? TGroup['items'][Key]['value']
      : unknown;
};

/**
 * Code Parameters Builder
 */
export class CodeParametersBuilder<TGroup extends CodeParameterGroup> {
  /**
   * Built Suggestions based on config
   */
  suggestions: CodeEditorSuggestionItem[] = [];

  constructor(group: TGroup, basePath = 'context') {
    /**
     * Add base suggestion
     */
    this.suggestions.push({
      label: basePath,
      kind: CodeEditorSuggestionItemKind.Constant,
      detail: group.detail,
    });

    /**
     * Add all suggestions
     */
    this.addSuggestions(basePath, group);
  }

  /**
   * Add suggestions
   * @param path
   * @param group
   * @private
   */
  private addSuggestions(path: string, group: CodeParameterGroup) {
    Object.entries(group.items).forEach(([key, item]) => {
      const itemPath = `${path}.${key}`;

      /**
       * Group
       */
      if ('items' in item) {
        this.suggestions.push({
          label: itemPath,
          detail: item.detail,
          kind: CodeEditorSuggestionItemKind.Property,
        });

        this.addSuggestions(itemPath, item);

        return;
      }

      /**
       * Item
       */
      this.suggestions.push({
        label: itemPath,
        detail: item.detail,
        kind: item.kind,
      });
    });
  }

  /**
   * Create payload method for type validation
   * @param payload
   */
  create(payload: PayloadForGroup<TGroup>) {
    return payload;
  }
}
