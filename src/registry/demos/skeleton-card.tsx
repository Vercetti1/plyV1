import { Skeleton } from "@/lib/ply";

export default function SkeletonCard() {
  return (
    <div className="w-full max-w-sm rounded-[var(--ply-radius)] border border-border-base bg-surface p-4">
      <div className="flex items-center gap-3">
        <Skeleton circle className="size-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-4">
        <Skeleton lines={3} />
      </div>
    </div>
  );
}
