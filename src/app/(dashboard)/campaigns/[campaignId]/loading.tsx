import { Skeleton } from '@/components/ui/skeleton';

export default function CampaignDetailLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-64 mt-2" />
          <Skeleton className="h-6 w-32 mt-2" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-[300px]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}