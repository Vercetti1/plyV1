"use client";

import { Accordion, AccordionItem } from "@/lib/ply";

export default function AccordionBasic() {
  return (
    <div className="w-full max-w-xl">
      <Accordion type="single" defaultValue={["a11y"]}>
        <AccordionItem value="a11y" title="Is Ply accessible?">
          Every interactive component implements its WAI-ARIA pattern: roving
          tabindex on tabs, focus trapping and scroll lock in dialogs, and a
          full keyboard contract on the select, including typeahead.
        </AccordionItem>
        <AccordionItem value="deps" title="What are the dependencies?">
          None. No <code>clsx</code>, no <code>cva</code>, no Floating UI, no
          icon package: the variant engine, class joiner and icon set are all
          part of the library.
        </AccordionItem>
        <AccordionItem value="theme" title="How do I re-theme it?">
          Override the CSS custom properties in <code>globals.css</code>. Every
          colour, radius and shadow in Ply resolves to one of those tokens, so
          one block re-skins the whole set in both light and dark.
        </AccordionItem>
        <AccordionItem value="soon" title="Coming in the next release" disabled>
          Command palette, data table, date picker.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
