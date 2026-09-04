import { Badge } from "@/lib/ply";

export default function BadgeTones() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Neutral</Badge>
      <Badge tone="accent">Beta</Badge>
      <Badge tone="success" dot>
        Deployed
      </Badge>
      <Badge tone="warning" dot>
        Degraded
      </Badge>
      <Badge tone="danger" dot>
        Failing
      </Badge>
      <Badge tone="solid">Pro</Badge>
      <Badge size="sm">v2.1.0</Badge>
    </div>
  );
}
