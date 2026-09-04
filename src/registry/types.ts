export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface DemoDef {
  id: string;
  title: string;
  description?: string;
}

export interface ComponentDef {
  slug: string;
  name: string;
  category: "Forms" | "Overlays" | "Navigation" | "Display" | "Feedback";
  summary: string;
  /** Paths, relative to src/lib/ply, of the files that make up the component. */
  sources: string[];
  /** Keyboard + ARIA contract, rendered as the "Accessibility" panel. */
  accessibility: string[];
  props: PropDef[];
  demos: DemoDef[];
  /** Sub-components documented alongside the main one. */
  anatomy?: { name: string; description: string }[];
}
