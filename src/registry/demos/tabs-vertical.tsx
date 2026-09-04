"use client";

import { Tabs, TabsList, TabsTrigger, TabsPanel } from "@/lib/ply";

export default function TabsVertical() {
  return (
    <div className="w-full max-w-2xl">
      <Tabs defaultValue="profile" orientation="vertical" activationMode="manual">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="tokens">API tokens</TabsTrigger>
        </TabsList>

        <TabsPanel value="profile" className="mt-0 flex-1">
          <h4 className="text-sm font-semibold text-fg">Profile</h4>
          <p className="mt-1 text-sm text-fg-muted">
            <code>activationMode=&quot;manual&quot;</code>: arrows move focus,
            Enter commits. Use it when a panel is expensive to render.
          </p>
        </TabsPanel>
        <TabsPanel value="team" className="mt-0 flex-1">
          <h4 className="text-sm font-semibold text-fg">Team</h4>
          <p className="mt-1 text-sm text-fg-muted">
            Vertical orientation remaps the arrow keys to up/down and sets
            <code>aria-orientation</code> accordingly.
          </p>
        </TabsPanel>
        <TabsPanel value="tokens" className="mt-0 flex-1">
          <h4 className="text-sm font-semibold text-fg">API tokens</h4>
          <p className="mt-1 text-sm text-fg-muted">No tokens yet.</p>
        </TabsPanel>
      </Tabs>
    </div>
  );
}
