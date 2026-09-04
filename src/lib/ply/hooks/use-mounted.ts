"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * `false` during server render and the hydration pass, `true` afterwards.
 *
 * Components that portal into `document.body` need this: the DOM target
 * doesn't exist on the server. `useSyncExternalStore` is the right tool
 * because it takes an explicit server snapshot, unlike setting state in an
 * effect, which triggers a second render on every mount.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
