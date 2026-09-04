import { cn } from "./cn";

/**
 * A tiny, fully-typed variant resolver in the spirit of `cva`.
 *
 * The point of writing it by hand is the type surface: `VariantProps<T>`
 * derives a component's prop types straight from its style config, so a new
 * variant key is a compile error everywhere it isn't handled, with no drift
 * between the styles and the public API.
 */

type VariantShape = Record<string, Record<string, string>>;

type BooleanKey<V extends string> = V extends "true" | "false" ? boolean : V;

export type VariantSelection<V extends VariantShape> = {
  [K in keyof V]?: BooleanKey<Extract<keyof V[K], string>>;
};

type CompoundRule<V extends VariantShape> = VariantSelection<V> & {
  className: string;
};

interface Config<V extends VariantShape> {
  variants?: V;
  defaultVariants?: VariantSelection<V>;
  compoundVariants?: CompoundRule<V>[];
}

export type VariantProps<T> = T extends (props: infer P) => string
  ? Omit<NonNullable<P>, "className">
  : never;

export function variants<V extends VariantShape>(base: string, config: Config<V> = {}) {
  const { variants: map, defaultVariants, compoundVariants } = config;

  return function resolve(
    props?: VariantSelection<V> & { className?: string },
  ): string {
    const selection = { ...defaultVariants, ...stripUndefined(props) } as Record<
      string,
      string | boolean | undefined
    >;

    const classes: string[] = [base];

    if (map) {
      for (const key of Object.keys(map)) {
        const value = selection[key];
        if (value === undefined || value === null) continue;
        const found = map[key][String(value)];
        if (found) classes.push(found);
      }
    }

    if (compoundVariants) {
      for (const rule of compoundVariants) {
        const { className, ...conditions } = rule as Record<string, unknown> & {
          className: string;
        };
        const matches = Object.entries(conditions).every(
          ([key, expected]) => String(selection[key]) === String(expected),
        );
        if (matches) classes.push(className);
      }
    }

    return cn(classes, props?.className);
  };
}

function stripUndefined<T extends object>(obj?: T): Partial<T> {
  if (!obj) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) out[key] = value;
  }
  return out as Partial<T>;
}

/** Shared focus treatment so every interactive component rings identically. */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ply-bg)]";
