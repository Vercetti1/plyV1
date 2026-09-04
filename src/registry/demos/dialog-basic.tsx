"use client";

import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Input,
} from "@/lib/ply";

export default function DialogBasic() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Invite teammate</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>
            They&apos;ll get an email with a link to join your workspace.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="grid gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="ada@example.com"
              // Focus lands here on open instead of the close button.
              data-ply-autofocus=""
            />
            <Input label="Message" placeholder="Optional note…" />
          </div>
        </DialogBody>

        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button>Send invite</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
