import { VariableModel } from '@grafana/data';

import { AdHocVariableModel } from '@grafana/data';

/** @deprecated use a if (model.type === "adhoc") type narrowing check instead */
export const isAdHoc = (model: VariableModel): model is AdHocVariableModel => {
  return model.type === 'adhoc';
};
