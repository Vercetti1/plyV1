"use client";

import { forwardRef, useId } from "react";
import { cn } from "../internal/cn";
import { useControllableState } from "../hooks/use-controllable-state";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: "sm" | "md";
  name?: string;
  id?: string;
  className?: string;
}

const TRACK = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
} as const;

const THUMB = {
  sm: "size-4 data-[state=checked]:translate-x-4",
  md: "size-5 data-[state=checked]:translate-x-5",
} as const;

/**
 * Built on a real `<button role="switch">` rather than a styled checkbox, so
 * Space/Enter, `aria-checked` and form labelling all behave natively. A hidden
 * input mirrors the value so it still submits inside an uncontrolled form.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    label,
    description,
    size = "md",
    name,
    id: idProp,
    className,
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = `${id}-description`;

  const [isChecked, setChecked] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const state = isChecked ? "checked" : "unchecked";

  const control = (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-describedby={description ? descriptionId : undefined}
      disabled={disabled}
      data-state={state}
      onClick={() => setChecked((prev) => !prev)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5",
        "transition-colors duration-200 ease-out",
        "outline-none focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ply-bg)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "bg-accent" : "bg-bg-inset border border-border-base",
        TRACK[size],
      )}
    >
      <span
        data-state={state}
        className={cn(
          "pointer-events-none rounded-full bg-white shadow-ply-sm",
          "transition-transform duration-200 ease-out",
          "translate-x-0",
          THUMB[size],
        )}
      />
      {name && (
        <input type="hidden" name={name} value={isChecked ? "on" : "off"} />
      )}
    </button>
  );

  if (!label && !description) {
    return <span className={className}>{control}</span>;
  }

  return (
    <div className={cn("flex items-start gap-3", className)}>
      {control}
      <div className="leading-tight">
        {label && (
          <label
            htmlFor={id}
            className="block cursor-pointer text-sm font-medium text-fg"
          >
            {label}
          </label>
        )}
        {description && (
          <p id={descriptionId} className="mt-0.5 text-xs text-fg-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
});
