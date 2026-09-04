"use client";

import { Tabs, TabsList, TabsTrigger, TabsPanel, Badge } from "@/lib/ply";

export default function TabsBasic() {
  return (
    <div className="w-full max-w-xl">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsPanel value="overview">
          <div className="flex items-center gap-2">
            <Badge tone="success" dot>
              Healthy
            </Badge>
            <span className="text-sm text-fg-muted">
              All 12 services responding.
            </span>
          </div>
        </TabsPanel>
        <TabsPanel value="activity">
          <p className="text-sm text-fg-muted">
            Focus a tab and press the arrow keys: the strip is a single tab
            stop, and selection follows focus.
          </p>
        </TabsPanel>
        <TabsPanel value="settings">
          <p className="text-sm text-fg-muted">
            Panels stay mounted and hidden, so scroll position and form state
            survive a tab switch.
          </p>
        </TabsPanel>
      </Tabs>
    </div>
  );
}
