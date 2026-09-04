"use client";

import { useState } from "react";
import { Switch } from "@/lib/ply";

export default function SwitchBasic() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="grid w-full max-w-sm gap-5">
      <Switch
        label="Email notifications"
        description="Get a digest of activity every morning."
        checked={notifications}
        onCheckedChange={setNotifications}
      />
      <Switch label="Public profile" defaultChecked={false} />
      <Switch label="Enforce 2FA" description="Locked by your admin." disabled />
      <div className="flex items-center gap-3">
        <Switch size="sm" defaultChecked aria-label="Compact toggle" />
        <span className="text-sm text-fg-muted">Small, unlabelled</span>
      </div>
    </div>
  );
}
