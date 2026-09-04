"use client";

import { useCallback, useState } from "react";

interface Options<T> {
  /** When provided, the component is controlled and never owns its state. */
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Lets a component be either controlled or uncontrolled through one API:
 * the pattern every serious component library needs and most hand-rolled
 * components get wrong.
 *
 * The setter accepts an updater function in both modes, resolving it against
 * whichever value is currently authoritative: local state when uncontrolled,
 * the `value` prop when controlled.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: Options<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const resolved = isControlled ? (value as T) : uncontrolled;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolvedNext =
        typeof next === "function"
          ? (next as (prev: T) => T)(resolved)
          : next;

      // No-op changes must not fire onChange, since consumers commonly persist
      // in that callback, and a toggle clicked twice shouldn't write twice.
      if (Object.is(resolvedNext, resolved)) return;
      if (!isControlled) setUncontrolled(resolvedNext);
      onChange?.(resolvedNext);
    },
    [resolved, isControlled, onChange],
  );

  return [resolved, setValue];
}
