
import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function TableSkeleton({ rows = 20, columns = 10 }: TableSkeletonProps) {
  return (
    <div className="w-full space-y-2 rounded-md border p-2">

      <div className="flex w-full items-center gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-[120px]" />
        ))}
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex w-full items-center gap-4 rounded-sm border px-2 py-2"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-[100px] flex-shrink-0" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}