"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../internal/cn";
import { variants, type VariantProps } from "../internal/variants";

const field = variants(
  cn(
    "w-full rounded-[var(--ply-radius)] border bg-surface text-fg",
    "placeholder:text-fg-subtle",
    "transition-[border-color,box-shadow] duration-150",
    "focus:outline-none focus:border-accent focus:ring-2 focus:ring-[var(--ply-accent-ring)]",
    "disabled:cursor-not-allowed disabled:bg-bg-inset disabled:text-fg-subtle",
  ),
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-[0.8125rem]",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      invalid: {
        true: "border-danger focus:border-danger focus:ring-[var(--ply-danger)]/30",
        false: "border-border-base",
      },
    },
    defaultVariants: { size: "md", invalid: false },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof field> {
  label?: string;
  /** Helper text shown below the field; hidden while an `error` is present. */
  hint?: string;
  /** Presence of an error switches the field to its invalid state. */
  error?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    size,
    label,
    hint,
    error,
    leadingIcon,
    trailingSlot,
    id: idProp,
    required,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const iconPadding =
    size === "sm" ? "pl-8" : size === "lg" ? "pl-11" : "pl-9.5";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-[0.8125rem] font-medium text-fg"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {leadingIcon && (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center text-fg-subtle",
              size === "lg" ? "pl-3.5 text-base" : "pl-3 text-sm",
            )}
          >
            {leadingIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          required={required}
          // Both flags matter: `aria-invalid` announces the state, and
          // `aria-describedby` is what actually reads the message out.
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            field({ size, invalid: Boolean(error) }),
            Boolean(leadingIcon) && iconPadding,
            Boolean(trailingSlot) && "pr-10",
            className,
          )}
          {...props}
        />

        {trailingSlot && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            {trailingSlot}
          </span>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
