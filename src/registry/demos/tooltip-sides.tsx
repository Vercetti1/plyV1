"use client";

import { Button, Tooltip } from "@/lib/ply";

export default function TooltipSides() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip content="Deploys to production immediately">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Appears below" side="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Appears on the left" side="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Appears on the right" side="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
      <Tooltip content="No delay when opened by keyboard focus" delay={0}>
        <Button variant="ghost">Instant</Button>
      </Tooltip>
    </div>
  );
}
