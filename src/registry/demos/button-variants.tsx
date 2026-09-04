"use client";

import { Button } from "@/lib/ply";
import { ChevronRightIcon, SearchIcon } from "@/lib/ply/components/icons";

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
      <Button variant="link">Read the docs</Button>
      <Button variant="secondary" leadingIcon={<SearchIcon />}>
        Search
      </Button>
      <Button trailingIcon={<ChevronRightIcon />}>Continue</Button>
      <Button variant="secondary" size="icon" aria-label="Search">
        <SearchIcon />
      </Button>
    </div>
  );
}
