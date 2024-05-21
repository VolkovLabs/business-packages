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

  /**
   * Form value
   */
  const [value, setValue] = useState(form.current.getValue());
  const valueRef = useRef(form.current.getValue());

  /**
   * Sync state value on field update
   */
  useEffect(() => {
    const unsubscribe = form.current.subscribeOnChange((value) => {
      setValue(value);
      valueRef.current = value;
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
    valueRef.current = value;
  }, []);

  /**
   * Re-create form
   */
  const create = useCallback((getForm: (builder: FormBuilder<TValue>) => typeof builder, initialValue?: TValue) => {
    form.current = getForm(
      new FormBuilder<TValue>({
        path: '',
        label: '',
      })
    );

    /**
     * Set new form state
     */
    onChange(initialValue ?? form.current.getValue());
  }, []);

  return {
    value,
    onChange,
    fields,
    valueRef,
    create,
  };
};
