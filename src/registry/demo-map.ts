import type { ComponentType } from "react";

import AccordionBasic from "./demos/accordion-basic";
import AvatarGroup from "./demos/avatar-group";
import BadgeTones from "./demos/badge-tones";
import ButtonLoading from "./demos/button-loading";
import ButtonSizes from "./demos/button-sizes";
import ButtonVariants from "./demos/button-variants";
import DialogBasic from "./demos/dialog-basic";
import DialogDestructive from "./demos/dialog-destructive";
import InputForm from "./demos/input-form";
import SelectBasic from "./demos/select-basic";
import SkeletonCard from "./demos/skeleton-card";
import SwitchBasic from "./demos/switch-basic";
import TabsBasic from "./demos/tabs-basic";
import TabsVertical from "./demos/tabs-vertical";
import ToastBasic from "./demos/toast-basic";
import TooltipSides from "./demos/tooltip-sides";

/**
 * Demo id → component. The matching source file is read off disk at request
 * time (see `readDemoSource`), so the code shown in the docs is always the
 * code that just rendered; there is no second copy to drift.
 */
export const demoComponents: Record<string, ComponentType> = {
  "accordion-basic": AccordionBasic,
  "avatar-group": AvatarGroup,
  "badge-tones": BadgeTones,
  "button-loading": ButtonLoading,
  "button-sizes": ButtonSizes,
  "button-variants": ButtonVariants,
  "dialog-basic": DialogBasic,
  "dialog-destructive": DialogDestructive,
  "input-form": InputForm,
  "select-basic": SelectBasic,
  "skeleton-card": SkeletonCard,
  "switch-basic": SwitchBasic,
  "tabs-basic": TabsBasic,
  "tabs-vertical": TabsVertical,
  "toast-basic": ToastBasic,
  "tooltip-sides": TooltipSides,
};
