# Ply

A dependency-free React component library in TypeScript and Tailwind CSS v4, with a
documentation site that renders each example's real source alongside the live component.

**12 components · 0 runtime dependencies · every WAI-ARIA pattern implemented properly**

```bash
npm install && npm run dev
```

## Why this exists

Most component libraries make you pick between a large dependency you can't change and
unstyled primitives you have to design from scratch. Ply is neither: it's plain TypeScript
you copy into a project and edit like your own code.

## What's worth looking at

| Area | File | What it demonstrates |
|---|---|---|
| Typed variant engine | [`internal/variants.ts`](src/lib/ply/internal/variants.ts) | A hand-rolled `cva` whose `VariantProps<T>` derives component prop types from the style config, so an unhandled variant is a compile error |
| Controlled/uncontrolled | [`use-controllable-state.ts`](src/lib/ply/hooks/use-controllable-state.ts) | One hook giving every stateful component both modes through a single API, updater functions included |
| Focus management | [`use-focus-trap.ts`](src/lib/ply/hooks/use-focus-trap.ts) | Tab cycling, autofocus targeting, and restoration that still works in browsers that don't focus buttons on click |
| Popup positioning | [`use-anchored-position.ts`](src/lib/ply/hooks/use-anchored-position.ts) | Portalled popups anchored to a trigger, flipped and height-clamped to the viewport, so no ancestor's `overflow: hidden` can clip them |
| Keyboard contract | [`select.tsx`](src/lib/ply/components/select.tsx) | A listbox with arrows, Home/End, Escape, Tab and printable-character typeahead, driven by `aria-activedescendant` |
| Roving tabindex | [`tabs.tsx`](src/lib/ply/components/tabs.tsx) | A tab strip that is one tab stop, with both automatic and manual activation modes |
| Self-documenting docs | [`[slug]/page.tsx`](src/app/docs/components/%5Bslug%5D/page.tsx) | A server component that reads each demo off disk and highlights it with Shiki, so the code shown is the file that produced the preview |

## Architecture

```
src/
├── lib/ply/              # The library. Portable: no Next.js or Node APIs.
│   ├── internal/         #   cn + the typed variant engine
│   ├── hooks/            #   controllable state, focus trap, scroll lock,
│   │                     #   outside-interaction, anchored position, mounted
│   └── components/       #   the 12 components + the icon set
├── registry/             # Component metadata (props, a11y contracts) + demos
├── components/docs/      # Docs-site chrome: sidebar, ⌘K palette, preview, tables
├── lib/highlight.ts      # Shiki, instantiated once per server process
├── lib/source.ts         # Reads demo/library source at render time
└── app/                  # Landing page + docs routes (all statically prerendered)
```

The split matters: `src/lib/ply` is the deliverable and knows nothing about the docs.
Everything else is the site that documents it.

## Design decisions

- **Tokens, not colours.** No component contains a literal colour. An `oklch` token set
  drives both themes, so a rebrand is a block of CSS variables. `oklch` is used because
  it's perceptually uniform: holding lightness constant and rotating hue produces status
  colours of genuinely matching weight.
- **`dark:` follows a class, not the media query,** so an explicit choice can override the
  OS setting. A blocking inline script applies it before first paint, since an effect would
  paint one frame of the wrong theme.
- **Panels hide rather than unmount.** Tab panels use `hidden`, so scroll position and
  form state survive a switch.
- **Accordion height animates with `grid-template-rows`** (`0fr` → `1fr`), so there's no
  height measurement and no JavaScript in the transition.
- **Everything collapses under `prefers-reduced-motion`.**

## Accessibility

Each component's page documents its own keyboard map and ARIA wiring. Verified in-browser:
focus trapping and restoration, scroll locking, `aria-activedescendant` on the select,
roving tabindex on tabs, `aria-invalid` + `aria-describedby` on field errors, a single
persistent live region for toasts, and `dismissable={false}` genuinely ignoring Escape.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Shiki

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build, all 16 routes prerender
npm run lint    # eslint, including react-hooks rules
npx tsc --noEmit
```
