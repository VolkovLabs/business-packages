import { EventBus, TypedVariableModel } from '@grafana/data';
import { getTemplateSrv, RefreshEvent } from '@grafana/runtime';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

/**
 * Use Dashboard Variables
 */
export const useDashboardVariables = <TVariable = TypedVariableModel, TState = TVariable[]>({
  eventBus,
  variableName,
  refreshCheckCount = 5,
  refreshCheckInterval = 500,
  getOne,
  toState,
  initial,
}: {
  eventBus: EventBus;
  variableName: string;
  refreshCheckCount?: number;
  refreshCheckInterval?: number;
  initial: TState;
  getOne: (state: TState, variableName: string) => TVariable | undefined;
  toState: (variables: TypedVariableModel[]) => TState;
}) => {
  /**
   * Memoize functions
   */
  const cachedFunctions = useRef({
    getOne,
    toState,
  });

  /**
   * State
   */
  const [variables, setVariables] = useState<TState>(initial);
  const [variable, setVariable] = useState<TVariable>();

  /**
   * For Scene Dashboard
   */
  const sceneObjectState = window.__grafanaSceneContext?.useState();
  const [refreshCount, forceUpdate] = useReducer((x) => x + 1, 0);
  const checkLoadingStateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Sometimes Variables have Loading State in Dashboard Scene
   * So just to refresh until loaded state or counter exceeded
   */
  useEffect(() => {
    /**
     * Non-scene dashboard so skip checking
     */
    if (!sceneObjectState?.$variables?.state.variables || refreshCount >= refreshCheckCount) {
      return;
    }

    const variables = sceneObjectState.$variables?.state.variables;
    const isLoading = variables?.some((variable) => variable?.state.loading);

    const clearTimer = () => {
      if (checkLoadingStateTimer.current) {
        clearTimeout(checkLoadingStateTimer.current);
        checkLoadingStateTimer.current = null;
      }
    };

    if (isLoading) {
      checkLoadingStateTimer.current = setTimeout(() => {
        forceUpdate();
      }, refreshCheckInterval);
    } else {
      clearTimer();
      setVariables(cachedFunctions.current.toState(getTemplateSrv().getVariables()));
    }

    return () => {
      clearTimer();
    };
  }, [sceneObjectState?.$variables?.state.variables, refreshCount]);

  /**
   * Load Variables
   */
  useEffect(() => {
    setVariables(cachedFunctions.current.toState(getTemplateSrv().getVariables()));

    /**
     * Update variable on Refresh
     */
    const subscriber = eventBus.getStream(RefreshEvent).subscribe(() => {
      setVariables(cachedFunctions.current.toState(getTemplateSrv().getVariables()));
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [eventBus]);

  const getVariable = useCallback(
    (variableName: string) => cachedFunctions.current.getOne(variables, variableName),
    [variables]
  );

  useEffect(() => {
    setVariable(getVariable(variableName));
  }, [getVariable, variableName]);

  return {
    variable,
    getVariable,
    variables,
  };
};
