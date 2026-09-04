import type { ComponentDef } from "./types";

export * from "./types";

export const components: ComponentDef[] = [
  {
    slug: "button",
    name: "Button",
    category: "Forms",
    summary:
      "Five variants, four sizes and a loading state that never changes the button's width.",
    sources: ["components/button.tsx", "internal/variants.ts"],
    accessibility: [
      "Renders a real <button>, so Space and Enter activate it natively.",
      "`loading` sets `aria-busy` and disables the control, while keeping the label mounted for assistive tech.",
      "Icon-only buttons require an `aria-label`; the docs demo shows the pattern.",
      "Focus ring is a 2px offset ring driven by `:focus-visible`, so it appears for keyboards but not mouse clicks.",
    ],
    props: [
      { name: "variant", type: `"primary" | "secondary" | "ghost" | "danger" | "link"`, default: `"primary"`, description: "Visual weight. `danger` is reserved for destructive actions." },
      { name: "size", type: `"sm" | "md" | "lg" | "icon"`, default: `"md"`, description: "Control height. `icon` yields a square button for a single glyph." },
      { name: "loading", type: "boolean", default: "false", description: "Swaps the label for a spinner and blocks interaction. Width is preserved." },
      { name: "leadingIcon", type: "ReactNode", description: "Rendered before the label." },
      { name: "trailingIcon", type: "ReactNode", description: "Rendered after the label." },
      { name: "fullWidth", type: "boolean", default: "false", description: "Stretches the button to fill its container." },
      { name: "…props", type: "ButtonHTMLAttributes", description: "Every native button attribute is forwarded, and the ref lands on the <button>." },
    ],
    demos: [
      { id: "button-variants", title: "Variants", description: "The five weights, plus icon composition." },
      { id: "button-sizes", title: "Sizes" },
      { id: "button-loading", title: "Loading state", description: "Click Save: the width holds steady while the spinner runs." },
    ],
  },
  {
    slug: "input",
    name: "Input",
    category: "Forms",
    summary:
      "A text field that owns its own label, hint and error wiring, including the ARIA that makes errors audible.",
    sources: ["components/input.tsx"],
    accessibility: [
      "`label` is a real <label htmlFor>, generated from `useId` when no `id` is passed.",
      "An `error` sets `aria-invalid` and points `aria-describedby` at the message, so screen readers announce it.",
      "The error node carries `role=\"alert\"`, so it is read the moment it appears.",
      "`hint` is also linked via `aria-describedby`, and is suppressed while an error is showing to avoid double announcement.",
    ],
    props: [
      { name: "label", type: "string", description: "Visible label, associated with the input." },
      { name: "hint", type: "string", description: "Helper text below the field. Hidden while `error` is set." },
      { name: "error", type: "string", description: "Error message. Its presence switches the field to the invalid state." },
      { name: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Control height." },
      { name: "leadingIcon", type: "ReactNode", description: "Decorative icon inside the field; padding adjusts automatically." },
      { name: "trailingSlot", type: "ReactNode", description: "Interactive slot on the right: a copy button, a unit, a reveal toggle." },
      { name: "…props", type: "InputHTMLAttributes", description: "All native input attributes, minus `size` (reused for our scale)." },
    ],
    demos: [
      { id: "input-form", title: "States", description: "Label, hint, live validation error, icon, trailing action and disabled." },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    category: "Forms",
    summary: "A toggle built on `role=\"switch\"`, controllable or uncontrolled, with an optional label and description.",
    sources: ["components/switch.tsx", "hooks/use-controllable-state.ts"],
    accessibility: [
      "A native <button role=\"switch\"> with `aria-checked`. Space and Enter both toggle it.",
      "`description` is linked with `aria-describedby` rather than stuffed into the label.",
      "A hidden input mirrors the value so the switch still submits inside an uncontrolled <form>.",
      "The thumb transition is disabled under `prefers-reduced-motion`.",
    ],
    props: [
      { name: "checked", type: "boolean", description: "Controlled value. Omit to let the component own its state." },
      { name: "defaultChecked", type: "boolean", default: "false", description: "Initial value when uncontrolled." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Fired on every change, in both modes." },
      { name: "label", type: "string", description: "Visible label; clicking it toggles the switch." },
      { name: "description", type: "string", description: "Secondary line under the label." },
      { name: "size", type: `"sm" | "md"`, default: `"md"`, description: "Track size." },
      { name: "name", type: "string", description: "Emits a hidden input under this name for form submission." },
    ],
    demos: [{ id: "switch-basic", title: "Usage" }],
  },
  {
    slug: "select",
    name: "Select",
    category: "Forms",
    summary:
      "A listbox-pattern select with the full native keyboard contract: arrows, Home/End, Escape and printable-character typeahead.",
    sources: ["components/select.tsx", "hooks/use-outside-interaction.ts"],
    accessibility: [
      "Trigger is `role=\"combobox\"` with `aria-expanded` and `aria-controls`; the popup is a `role=\"listbox\"` of `role=\"option\"` items.",
      "DOM focus stays on the trigger while `aria-activedescendant` reports the highlighted option, the pattern screen readers expect.",
      "Arrow keys wrap and skip disabled options; Home/End jump to the ends.",
      "Typing a printable character jumps to the first matching label, with a 500 ms buffer for multi-character search.",
      "Escape closes without committing; Tab closes and moves on, matching a native <select>.",
      "Pointer movement only highlights and never commits, so the mouse and keyboard models stay in sync.",
    ],
    props: [
      { name: "options", type: "SelectOption[]", required: true, description: "`{ value, label, description?, disabled? }`." },
      { name: "value", type: "string", description: "Controlled value." },
      { name: "defaultValue", type: "string", default: `""`, description: "Initial value when uncontrolled." },
      { name: "onValueChange", type: "(value: string) => void", description: "Fired when an option is committed." },
      { name: "placeholder", type: "string", default: `"Select an option"`, description: "Shown when nothing is selected." },
      { name: "label", type: "string", description: "Visible label, linked via `aria-labelledby`." },
      { name: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Trigger height." },
    ],
    demos: [
      { id: "select-basic", title: "Keyboard-first select", description: "Try the arrow keys, then type a letter." },
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    category: "Overlays",
    summary:
      "A modal that actually behaves like one: focus trapped, scroll locked, focus restored, and dismissal you can switch off.",
    sources: [
      "components/dialog.tsx",
      "hooks/use-focus-trap.ts",
      "hooks/use-scroll-lock.ts",
    ],
    accessibility: [
      "Panel is `role=\"dialog\"` `aria-modal=\"true\"`, labelled and described by <DialogTitle> and <DialogDescription> through generated ids.",
      "Tab and Shift+Tab are trapped inside the panel, so keyboard users can't wander into the page behind the overlay.",
      "Focus moves to `[data-ply-autofocus]`, else the first tabbable node, and is restored to the trigger on close.",
      "Body scroll is locked with scrollbar-width compensation, and the lock is reference-counted for nested overlays.",
      "The overlay is `aria-hidden` decoration. Escape is the keyboard route out, not a focusable div.",
      "`dismissable={false}` removes the overlay click, Escape handler and close button for flows that need a deliberate choice.",
    ],
    anatomy: [
      { name: "Dialog", description: "State container. Controlled via `open`/`onOpenChange` or uncontrolled via `defaultOpen`." },
      { name: "DialogTrigger", description: "Opens the dialog when its child is clicked." },
      { name: "DialogContent", description: "Portals to <body>, and owns the trap, scroll lock and animation." },
      { name: "DialogHeader / DialogTitle / DialogDescription", description: "Title and description also supply the dialog's accessible name." },
      { name: "DialogBody", description: "Scrollable content region, capped at 60vh." },
      { name: "DialogFooter", description: "Action bar; stacks in reverse on mobile so the primary action sits lowest." },
      { name: "DialogClose", description: "Closes the dialog when its child is clicked." },
    ],
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fired whenever the dialog opens or closes." },
      { name: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "On <DialogContent>. Max width of the panel." },
      { name: "dismissable", type: "boolean", default: "true", description: "On <DialogContent>. When false, only your own buttons can close it." },
    ],
    demos: [
      { id: "dialog-basic", title: "Form dialog", description: "Open it and press Tab repeatedly: focus never leaves the panel." },
      { id: "dialog-destructive", title: "Non-dismissable confirm", description: "Escape and overlay clicks are disabled here by design." },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Overlays",
    summary: "A four-sided tooltip with a hover delay, instant keyboard open, and Escape to dismiss.",
    sources: ["components/tooltip.tsx"],
    accessibility: [
      "The bubble is `role=\"tooltip\"`, linked to the trigger with `aria-describedby` only while visible.",
      "Focus opens it with no delay, since a keyboard user has already committed, while hover waits out `delay`.",
      "Escape dismisses it, so a tooltip can never permanently obscure content (WCAG 1.4.13).",
      "Clones the trigger element rather than wrapping it in a focusable node, so the tab order is unchanged.",
    ],
    props: [
      { name: "content", type: "ReactNode", required: true, description: "Tooltip body. Keep it short; it isn't a popover." },
      { name: "side", type: `"top" | "bottom" | "left" | "right"`, default: `"top"`, description: "Placement relative to the trigger." },
      { name: "delay", type: "number", default: "250", description: "Hover delay in ms. Focus ignores it." },
      { name: "children", type: "ReactElement", required: true, description: "A single focusable element to describe." },
    ],
    demos: [{ id: "tooltip-sides", title: "Placement" }],
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Navigation",
    summary:
      "Horizontal or vertical tabs implementing the WAI-ARIA pattern, with a roving tabindex and a choice of activation mode.",
    sources: ["components/tabs.tsx"],
    accessibility: [
      "Roving tabindex: the strip is a single tab stop and arrow keys move between tabs, not one stop per tab.",
      "Arrow keys wrap around and skip disabled tabs; Home and End jump to the ends.",
      "Vertical orientation remaps the arrows to up/down and sets `aria-orientation`.",
      "`activationMode=\"automatic\"` selects on focus (the ARIA default); `\"manual\"` moves focus only, for panels that are expensive to render.",
      "Panels are `hidden` rather than unmounted, so scroll position and form state survive a switch.",
      "Every tab/panel pair is cross-linked with `aria-controls` and `aria-labelledby`.",
    ],
    anatomy: [
      { name: "Tabs", description: "State container and orientation/activation config." },
      { name: "TabsList", description: "`role=\"tablist\"`; owns the roving-tabindex key handler." },
      { name: "TabsTrigger", description: "`role=\"tab\"`, keyed by `value`." },
      { name: "TabsPanel", description: "`role=\"tabpanel\"`, matched to its trigger by `value`." },
    ],
    props: [
      { name: "value", type: "string", description: "Controlled active tab." },
      { name: "defaultValue", type: "string", required: true, description: "Initially active tab." },
      { name: "onValueChange", type: "(value: string) => void", description: "Fired on tab change." },
      { name: "orientation", type: `"horizontal" | "vertical"`, default: `"horizontal"`, description: "Also determines which arrow keys navigate." },
      { name: "activationMode", type: `"automatic" | "manual"`, default: `"automatic"`, description: "Whether selection follows focus." },
    ],
    demos: [
      { id: "tabs-basic", title: "Horizontal", description: "Focus a tab and use the arrow keys." },
      { id: "tabs-vertical", title: "Vertical, manual activation" },
    ],
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "Navigation",
    summary:
      "Single or multiple open sections, with a height animation that needs no JavaScript measurement.",
    sources: ["components/accordion.tsx"],
    accessibility: [
      "Each header is a <button aria-expanded aria-controls> inside an <h3>, giving screen readers a real document outline.",
      "Panels are `role=\"region\"` labelled by their trigger.",
      "Arrow keys move between headers, Home/End jump to the ends, per the WAI-ARIA accordion pattern.",
      "`collapsible={false}` keeps one section always open in single mode.",
    ],
    props: [
      { name: "type", type: `"single" | "multiple"`, default: `"single"`, description: "Whether opening a section closes the others." },
      { name: "value", type: "string[]", description: "Controlled list of open item values." },
      { name: "defaultValue", type: "string[]", default: "[]", description: "Initially open items." },
      { name: "onValueChange", type: "(value: string[]) => void", description: "Fired whenever the open set changes." },
      { name: "collapsible", type: "boolean", default: "true", description: "In single mode, allows closing the open item." },
    ],
    demos: [{ id: "accordion-basic", title: "Single, collapsible" }],
  },
  {
    slug: "toast",
    name: "Toast",
    category: "Feedback",
    summary:
      "A provider plus a `useToast()` hook, backed by one persistent live region so announcements actually fire.",
    sources: ["components/toast.tsx"],
    accessibility: [
      "The live region is mounted once, up front. Injecting a region together with its content is the classic reason screen readers announce nothing.",
      "`aria-live=\"polite\"` so a toast never interrupts what the user is reading.",
      "Each dismiss button is labelled with its toast's title, so a list of them isn't five identical “Close” buttons.",
      "`duration: 0` pins a toast open, the right default for errors the user must read.",
    ],
    props: [
      { name: "toast()", type: "(input: { title, description?, tone?, duration? }) => string", description: "Queues a toast and returns its id." },
      { name: "dismiss()", type: "(id: string) => void", description: "Removes a toast early." },
      { name: "tone", type: `"info" | "success" | "warning" | "danger"`, default: `"info"`, description: "Icon and accent colour." },
      { name: "duration", type: "number", default: "4500", description: "Auto-dismiss delay in ms. `0` disables it." },
      { name: "max", type: "number", default: "4", description: "On <ToastProvider>. Oldest toasts drop past this count." },
    ],
    demos: [{ id: "toast-basic", title: "Tones" }],
  },
  {
    slug: "badge",
    name: "Badge",
    category: "Display",
    summary: "Compact status labels in six tones, with an optional status dot.",
    sources: ["components/badge.tsx"],
    accessibility: [
      "The dot is `aria-hidden` decoration: the tone is never the only carrier of meaning, so the label always states the status in words.",
      "Renders a plain <span>: use a <Button> if it needs to be clickable.",
    ],
    props: [
      { name: "tone", type: `"neutral" | "accent" | "success" | "warning" | "danger" | "solid"`, default: `"neutral"`, description: "Colour treatment." },
      { name: "size", type: `"sm" | "md"`, default: `"md"`, description: "Badge height." },
      { name: "dot", type: "boolean", default: "false", description: "Prefixes a small dot in the current colour." },
    ],
    demos: [{ id: "badge-tones", title: "Tones" }],
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "Display",
    summary:
      "An image avatar that degrades to deterministic coloured initials, never to a broken-image icon.",
    sources: ["components/avatar.tsx"],
    accessibility: [
      "`name` is required and doubles as the image's alt text.",
      "When it falls back to initials, the initials are `aria-hidden` and the full name is exposed via `sr-only`, because “AL” is not a useful announcement.",
      "The status dot also carries an `sr-only` label.",
    ],
    props: [
      { name: "name", type: "string", required: true, description: "Used for alt text, initials and the fallback colour." },
      { name: "src", type: "string", description: "Image URL. On error, falls back to initials." },
      { name: "size", type: `"xs" | "sm" | "md" | "lg"`, default: `"md"`, description: "Avatar diameter." },
      { name: "status", type: `"online" | "away" | "offline"`, description: "Renders a labelled presence dot." },
    ],
    demos: [{ id: "avatar-group", title: "Sizes, presence and stacking" }],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Feedback",
    summary: "Shimmering placeholders for content that hasn't arrived yet.",
    sources: ["components/skeleton.tsx"],
    accessibility: [
      "A single skeleton is `aria-hidden`: it's decoration around content that is already being announced elsewhere.",
      "A multi-line group is `role=\"status\"` with an accessible “Loading” name, so the wait is announced once rather than per line.",
      "The shimmer is a composited transform, and stops entirely under `prefers-reduced-motion`.",
    ],
    props: [
      { name: "lines", type: "number", default: "1", description: "Stacked lines; the last is shortened for a natural look." },
      { name: "circle", type: "boolean", default: "false", description: "Fully rounds the placeholder for avatars." },
      { name: "className", type: "string", description: "Set the size; skeletons carry no intrinsic dimensions beyond a default line height." },
    ],
    demos: [{ id: "skeleton-card", title: "Loading card" }],
  },
];

export const categories = [
  "Forms",
  "Overlays",
  "Navigation",
  "Display",
  "Feedback",
] as const;

export function getComponent(slug: string) {
  return components.find((component) => component.slug === slug);
}

export function componentsByCategory() {
  return categories.map((category) => ({
    category,
    items: components.filter((component) => component.category === category),
  }));
}
