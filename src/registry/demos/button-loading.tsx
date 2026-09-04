"use client";

import { useState } from "react";
import { Button } from "@/lib/ply";

export default function ButtonLoading() {
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setSaving(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading={saving} onClick={save}>
        Save changes
      </Button>
      <Button variant="secondary" loading>
        Always loading
      </Button>
      <p className="text-xs text-fg-muted">
        The label stays mounted while loading, so the button never changes width.
      </p>
    </div>
  );
}
