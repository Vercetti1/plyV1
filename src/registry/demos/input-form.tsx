"use client";

import { useState } from "react";
import { Button, Input } from "@/lib/ply";
import { SearchIcon } from "@/lib/ply/components/icons";

export default function InputForm() {
  const [email, setEmail] = useState("not-an-email");
  const invalid = email.length > 0 && !email.includes("@");

  return (
    <div className="grid w-full max-w-sm gap-4">
      <Input
        label="Workspace name"
        placeholder="Acme Inc."
        hint="Shown to everyone on your team."
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={invalid ? "Enter a valid email address." : undefined}
      />
      <Input
        leadingIcon={<SearchIcon />}
        placeholder="Search components…"
        aria-label="Search components"
      />
      <Input
        label="API key"
        defaultValue="ply_live_8f2c…"
        readOnly
        trailingSlot={
          <Button variant="ghost" size="sm" className="h-7">
            Copy
          </Button>
        }
      />
      <Input label="Disabled" placeholder="Unavailable" disabled />
    </div>
  );
}
