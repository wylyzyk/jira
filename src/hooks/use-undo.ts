import { useCallback, useReducer } from "react";

enum ACTION_TYPE {
  UNDO = "UNDO",
  REDO = "REDO",
  SET = "SET",
  RESET = "RESET",
}

type TState<T> = {
  past: T[];
  present: T;
  future: T[];
};

type TAction<T> = { newPresent?: T; type: ACTION_TYPE };

const undoReducer = <T>(state: TState<T>, action: TAction<T>) => {
  const { past, present, future } = state;
  const { type, newPresent } = action;

  switch (type) {
    case ACTION_TYPE.UNDO:
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    case ACTION_TYPE.REDO:
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    case ACTION_TYPE.RESET:
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    case ACTION_TYPE.SET:
      if (newPresent === present) {
        return state;
      }

      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    default:
      return state;
  }
};

export const useUndo = <T>(initialPresent: T) => {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  } as TState<T>);

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => dispatch({ type: ACTION_TYPE.UNDO }), []);
  const redo = useCallback(() => dispatch({ type: ACTION_TYPE.REDO }), []);
  const set = useCallback(
    (newPresent: T) => dispatch({ type: ACTION_TYPE.SET, newPresent }),
    []
  );
  const reset = useCallback(
    (newPresent: T) => dispatch({ type: ACTION_TYPE.RESET, newPresent }),
    []
  );

  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const;
};
