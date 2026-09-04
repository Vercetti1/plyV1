"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
  Tooltip,
  useToast,
} from "@/lib/ply";

/**
 * The hero's live panel. It is deliberately one composed interface rather
 * than a grid of isolated components: the point is that these pieces sit
 * together without any per-page style patching.
 */
export function LandingShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [region, setRegion] = useState("fra");
  const [autoDeploy, setAutoDeploy] = useState(true);
  const { toast } = useToast();

  return (
    <div className="overflow-hidden rounded-2xl border border-border-base bg-surface shadow-ply-lg">
      <div className="flex items-center gap-3 border-b border-border-base bg-bg-subtle px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
        </div>
        <span className="font-mono text-xs text-fg-muted">atlas-api</span>
        <Badge tone="success" dot size="sm" className="ml-auto">
          Live
        </Badge>
      </div>

      <div className="p-5">
        <Tabs defaultValue="deploy">
          <TabsList>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsPanel value="deploy" className="space-y-4">
            <Select
              label="Region"
              options={[
                { value: "iad", label: "us-east-1", description: "N. Virginia" },
                { value: "fra", label: "eu-central-1", description: "Frankfurt" },
                { value: "lag", label: "af-west-1", description: "Lagos" },
              ]}
              value={region}
              onValueChange={setRegion}
            />
            <Switch
              label="Auto-deploy on push"
              description="Builds every commit to main."
              checked={autoDeploy}
              onCheckedChange={setAutoDeploy}
            />
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                onClick={() =>
                  toast({
                    title: "Deployment queued",
                    description: `atlas-api → ${region}. Build #482.`,
                    tone: "success",
                  })
                }
              >
                Deploy
              </Button>
              <Tooltip content="Escape dismisses this tooltip">
                <Button variant="secondary">Preview</Button>
              </Tooltip>
              <Button variant="ghost" onClick={() => setDialogOpen(true)}>
                Settings
              </Button>
            </div>
          </TabsPanel>

          <TabsPanel value="team" className="space-y-3">
            {[
              { name: "Ada Lovelace", role: "Owner", status: "online" as const },
              { name: "Grace Hopper", role: "Admin", status: "away" as const },
              { name: "Alan Turing", role: "Developer", status: "offline" as const },
            ].map((member) => (
              <div key={member.name} className="flex items-center gap-3">
                <Avatar name={member.name} size="sm" status={member.status} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{member.name}</p>
                  <p className="text-xs text-fg-muted">{member.role}</p>
                </div>
                <Badge size="sm">{member.status}</Badge>
              </div>
            ))}
          </TabsPanel>

          <TabsPanel value="logs">
            <pre className="overflow-x-auto rounded-[var(--ply-radius)] bg-bg-inset p-3 font-mono text-[0.6875rem] leading-relaxed text-fg-muted">
{`14:02:11  ✓ build succeeded in 8.4s
14:02:12  → uploading 42 assets
14:02:19  ✓ deployed to eu-central-1
14:02:19    https://atlas-api.ply.dev`}
            </pre>
          </TabsPanel>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Project settings</DialogTitle>
            <DialogDescription>
              Focus is trapped in here. Hold Tab and see.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Input label="Project name" defaultValue="atlas-api" data-ply-autofocus="" />
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
