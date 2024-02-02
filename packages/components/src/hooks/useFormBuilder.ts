import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FormBuilder } from '../utils';

export const useFormBuilder = <TValue extends object>(getForm: (builder: FormBuilder<TValue>) => typeof builder) => {
  const form = useRef(
    getForm(
      new FormBuilder<TValue>({
        path: '',
        label: '',
      })
    )
  );

  const [value, setValue] = useState(form.current.getValue());

  /**
   * Sync state value on field update
   */
  useEffect(() => {
    const unsubscribe = form.current.subscribeOnChange((value) => {
      setValue(value);
    });

    return () => {
      unsubscribe();
    };
  }, [value]);

  /**
   * Return new fields on value change
   */
  const fields = useMemo(() => {
    return form.current.getFields();
  }, [value]);

  /**
   * On Change
   */
  const onChange = useCallback((value: TValue) => {
    form.current.setValue(value);
    setValue(value);
  }, []);

  return {
    value,
    onChange,
    fields,
  };
};
