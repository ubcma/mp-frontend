import { Skeleton } from '../ui/skeleton';

export default function EventPageSkeleton() {
  return (
    <div className="space-y-6">

      <Skeleton className="h-80 w-full rounded-xl" />

      <div className="space-y-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-48 rounded-full" /> 
        <Skeleton className="h-10 w-32 rounded-full" /> 
        <Skeleton className="h-10 w-36 rounded-full" /> 
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-12 w-48 rounded-lg" />
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>
    </div>
  );
}
