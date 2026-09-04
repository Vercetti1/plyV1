import { Avatar } from "@/lib/ply";

export default function AvatarGroup() {
  const team = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Radia Perlman"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Avatar name="Ada Lovelace" size="xs" />
        <Avatar name="Grace Hopper" size="sm" status="online" />
        <Avatar name="Alan Turing" size="md" status="away" />
        <Avatar name="Radia Perlman" size="lg" status="offline" />
      </div>

      <div className="flex items-center">
        {team.map((name, index) => (
          <Avatar
            key={name}
            name={name}
            className={index > 0 ? "-ml-2 ring-2 ring-[var(--ply-bg)] rounded-full" : ""}
          />
        ))}
        <span className="-ml-2 inline-flex size-10 items-center justify-center rounded-full border border-border-base bg-bg-inset text-xs font-semibold text-fg-muted ring-2 ring-[var(--ply-bg)]">
          +7
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* A broken URL falls back to initials, never a broken-image icon. */}
        <Avatar name="Katherine Johnson" src="https://example.invalid/nope.png" />
        <span className="text-sm text-fg-muted">Failed image → initials fallback</span>
      </div>
    </div>
  );
}
