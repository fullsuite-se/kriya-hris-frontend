import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AccessControlSkeleton() {
  return (
    <div>
      {/* Cards Grid Skeleton */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-5">
        {[...Array(5)].map((_, index) => (
          <Card
            key={index}
            className="rounded-2xl !shadow-none !border-none p-5"
          >
            <CardContent className="p-0 flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-20 bg-gray-200" />
              </div>
              <Skeleton className="h-8 w-12 bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table Section Skeleton */}
      <Card className="rounded-lg p-5 !shadow-none !border-none">
        {/* Search Bar Skeleton */}
        <div className=" flex gap-2 items-stretch min-w-0">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="space-y-4">
          {/* Table Header Skeleton - Simplified for 3 columns */}
          <div className="grid grid-cols-12 gap-4 px-4 mb-2 ">
            <Skeleton className="h-4 bg-gray-200 col-span-2" /> {/* User */}
            <Skeleton className="h-4 bg-gray-200 col-span-5" />{" "}
            {/* Service Accesses */}
            <Skeleton className="h-4 bg-gray-200 col-span-3" /> {/* Actions */}
            <Skeleton className="h-4 bg-gray-200 col-span-2" /> {/* Actions */}
          </div>

          {/* Table Rows Skeleton - Simplified */}
          {[...Array(6)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-4 py-3 border-b"
            >
              <div className="hidden sm:col-span-2  sm:flex items-center">
                <Skeleton className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>

              {/* User Info - Same for mobile and desktop */}
              <div className="sm:col-span-5 flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                  <Skeleton className="h-3 w-1/2 bg-gray-200" />
                </div>
              </div>

              {/* Service Accesses - Same for mobile and desktop */}
              <div className="hidden sm:col-span-3 sm:flex items-center space-x-3">
                <Skeleton className="h-6 w-16 bg-gray-200 rounded-full" />
                <Skeleton className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>

              {/* Actions - Same for mobile and desktop */}
              <div className="hidden sm:col-span-2 sm:flex items-center justify-end space-x-2">
                <Skeleton className="h-8 w-8 rounded-md bg-gray-200" />
                <Skeleton className="h-8 w-8 rounded-md bg-gray-200" />
              </div>
            </div>
          ))}

          {/* Pagination Skeleton */}
          <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t">
            <Skeleton className="h-4 w-32 bg-gray-200" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-20 bg-gray-200" />
              <div className="flex space-x-1">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-9 w-9 bg-gray-200" />
                ))}
              </div>
              <Skeleton className="h-9 w-20 bg-gray-200" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
