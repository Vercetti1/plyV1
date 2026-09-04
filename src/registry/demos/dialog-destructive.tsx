"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/lib/ply";

export default function DialogDestructive() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>

      {/* Controlled, and `dismissable={false}`: no overlay click, no Escape,
          no close button. A destructive action needs an explicit choice. */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm" dismissable={false}>
          <DialogHeader>
            <DialogTitle>Delete “atlas-api”?</DialogTitle>
            <DialogDescription>
              This removes 3 deployments and 1.2 GB of build cache. It cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
