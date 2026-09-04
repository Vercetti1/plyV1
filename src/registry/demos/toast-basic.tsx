"use client";

import { Button, useToast } from "@/lib/ply";

export default function ToastBasic() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Deployment queued",
            description: "atlas-api → production. Build #482.",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: "Copied to clipboard", tone: "success" })}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Approaching your quota",
            description: "You've used 92% of this month's build minutes.",
            tone: "warning",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "Build failed",
            description: "Type error in src/server/db.ts:41.",
            tone: "danger",
            duration: 0, // Sticks until dismissed.
          })
        }
      >
        Error (sticky)
      </Button>
    </div>
  );
}
