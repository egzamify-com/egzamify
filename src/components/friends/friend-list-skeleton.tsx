import { Card, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export default function FriendsSkeleton({
  countOfSkeletons,
}: {
  countOfSkeletons: number
}) {
  return (
    <>
      {Array.from({ length: countOfSkeletons }).map((_, index) => (
        <Card key={index} className="my-3 animate-pulse">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Profile Picture Skeleton */}
                <div className="relative">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2">
                    <Skeleton className="h-full w-full rounded-full" />
                  </div>
                </div>

                {/* Friend Info Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
