"use client";

import { useState } from "react";
import { Select } from "@/lib/ply";

const REGIONS = [
  { value: "iad", label: "us-east-1", description: "N. Virginia" },
  { value: "sfo", label: "us-west-1", description: "N. California" },
  { value: "fra", label: "eu-central-1", description: "Frankfurt" },
  { value: "lag", label: "af-west-1", description: "Lagos" },
  { value: "syd", label: "ap-southeast-2", description: "Sydney · at capacity", disabled: true },
];

export default function SelectBasic() {
  const [region, setRegion] = useState("fra");

  return (
    <div className="grid w-full max-w-sm gap-4">
      <Select
        label="Deploy region"
        options={REGIONS}
        value={region}
        onValueChange={setRegion}
      />
      <p className="text-xs text-fg-muted">
        Focus the trigger and type <kbd className="rounded border border-border-base bg-bg-inset px-1">a</kbd>{" "}
        to jump by name, or use the arrow keys.
      </p>
    </div>
  );
}
