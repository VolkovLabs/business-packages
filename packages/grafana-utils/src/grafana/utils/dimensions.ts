import { DataFrame, Field, getFieldDisplayName } from '@grafana/data';

export function findField(frame?: DataFrame, name?: string): Field | undefined {
  const idx = findFieldIndex(frame, name);
  return idx == null ? undefined : frame!.fields[idx];
}

export function findFieldIndex(frame?: DataFrame, name?: string): number | undefined {
  if (!frame || !name?.length) {
    return undefined;
  }

  for (let i = 0; i < frame.fields.length; i++) {
    const field = frame.fields[i];
    if (name === field.name) {
      return i;
    }
    const disp = getFieldDisplayName(field, frame);
    if (name === disp) {
      return i;
    }
  }
  return undefined;
}
