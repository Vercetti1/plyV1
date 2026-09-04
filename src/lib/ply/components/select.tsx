"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../internal/cn";
import { useAnchoredPosition } from "../hooks/use-anchored-position";
import { useControllableState } from "../hooks/use-controllable-state";
import { useMounted } from "../hooks/use-mounted";
import { useOutsideInteraction } from "../hooks/use-outside-interaction";
import { CheckIcon, ChevronDownIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TRIGGER_SIZES = {
  sm: "h-8 px-2.5 text-[0.8125rem]",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
} as const;

/**
 * A listbox-pattern select. Native `<select>` can't be styled consistently
 * across platforms, so this reimplements the keyboard contract by hand:
 * arrows, Home/End, Enter/Space, Escape, and printable-character typeahead,
 * with `aria-activedescendant` telling screen readers which option is
 * highlighted while DOM focus stays on the trigger.
 *
 * The popup is portalled to <body> and anchored to the trigger, so it is
 * never clipped by a card, dialog body or tab panel that hides overflow.
 */
export function Select({
  options,
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Select an option",
  label,
  disabled,
  size = "md",
  className,
}: SelectProps) {
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: "", timer: undefined as ReturnType<typeof setTimeout> | undefined });

  const mounted = useMounted();
  // The listbox is portalled, so it escapes any ancestor `overflow: hidden`
  // and is positioned against the trigger instead.
  const { style: listStyle, placement } = useAnchoredPosition(triggerRef, open);

  const baseId = useId();
  const listId = `${baseId}-listbox`;
  const labelId = `${baseId}-label`;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selected),
    [options, selected],
  );

  const enabledIndexes = useMemo(
    () => options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i !== -1),
    [options],
  );

  useOutsideInteraction([triggerRef, listRef], () => setOpen(false), open);

  const openList = useCallback(() => {
    const selectedIndex = options.findIndex((o) => o.value === selected);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1));
    setOpen(true);
  }, [options, selected, enabledIndexes]);

  const commit = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      setSelected(option.value);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [options, setSelected],
  );

  const move = useCallback(
    (direction: 1 | -1) => {
      if (enabledIndexes.length === 0) return;
      const position = enabledIndexes.indexOf(activeIndex);
      const next =
        position === -1
          ? enabledIndexes[direction === 1 ? 0 : enabledIndexes.length - 1]
          : enabledIndexes[
              (position + direction + enabledIndexes.length) % enabledIndexes.length
            ];
      setActiveIndex(next);
    },
    [activeIndex, enabledIndexes],
  );

  /** Jumps to the first option matching the characters typed within 500ms. */
  const runTypeahead = useCallback(
    (char: string) => {
      clearTimeout(typeahead.current.timer);
      typeahead.current.query += char.toLowerCase();
      typeahead.current.timer = setTimeout(() => {
        typeahead.current.query = "";
      }, 500);

      const match = options.findIndex(
        (option) =>
          !option.disabled &&
          option.label.toLowerCase().startsWith(typeahead.current.query),
      );
      if (match !== -1) {
        setActiveIndex(match);
        if (!open) commit(match);
      }
    },
    [options, open, commit],
  );

  function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) move(1);
        else openList();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (open) move(-1);
        else openList();
        break;
      case "Home":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(enabledIndexes[0] ?? -1);
        break;
      case "End":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) commit(activeIndex);
        else openList();
        break;
      case "Escape":
        if (!open) return;
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        // Tabbing away commits nothing and closes, matching native behaviour.
        if (open) setOpen(false);
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          runTypeahead(event.key);
        }
    }
  }

  // Keep the highlighted option visible when arrowing through a long list.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <span id={labelId} className="mb-1.5 block text-[0.8125rem] font-medium text-fg">
          {label}
        </span>
      )}

      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-activedescendant={
          open && activeIndex >= 0 ? `${baseId}-option-${activeIndex}` : undefined
        }
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[var(--ply-radius)]",
          "border border-border-base bg-surface text-left text-fg",
          "transition-[border-color,box-shadow] duration-150 outline-none",
          "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-[var(--ply-accent-ring)]",
          "disabled:cursor-not-allowed disabled:bg-bg-inset disabled:text-fg-subtle",
          TRIGGER_SIZES[size],
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-fg-subtle")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-fg-subtle transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && mounted && createPortal(
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          tabIndex={-1}
          data-placement={placement}
          style={listStyle}
          className={cn(
            "ply-animate-slide-down z-50 overflow-y-auto",
            "rounded-[var(--ply-radius)] border border-border-base bg-surface p-1 shadow-ply-lg",
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selected;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${baseId}-option-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                // Pointer moves only highlight; the click commits. Mirrors
                // the trigger's keyboard model so both stay in sync.
                onMouseMove={() => !option.disabled && setActiveIndex(index)}
                onClick={() => commit(index)}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-[calc(var(--ply-radius)-4px)] px-2.5 py-2 text-sm",
                  isActive && "bg-bg-inset",
                  option.disabled && "cursor-not-allowed opacity-40",
                )}
              >
                <CheckIcon
                  className={cn(
                    "mt-0.5 size-4 shrink-0 text-accent",
                    !isSelected && "invisible",
                  )}
                />
                <span className="min-w-0">
                  <span className="block truncate text-fg">{option.label}</span>
                  {option.description && (
                    <span className="mt-0.5 block text-xs text-fg-muted">
                      {option.description}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </div>
  );
}
