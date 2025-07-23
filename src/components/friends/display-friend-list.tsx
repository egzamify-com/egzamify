import { api } from "convex/_generated/api";
import { useQueryWithStatus } from "convex/helpers";
import type { Infer } from "convex/values";
import { Search } from "lucide-react";
import { useState, type ReactNode } from "react";
import useDebouncedSearch from "~/hooks/use-debounced-search";
import { cn } from "~/lib/utils";
import { friendFilterValidator } from "../../../convex/friends/query";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import Friend from "./friend";

export default function DisplayFriendList({
  filter,
  headerTitle,
  disableTopPadding = false,
  headerDescription,
  notFoundComponent,
  errorComponent,
}: {
  filter: Infer<typeof friendFilterValidator>;
  headerTitle: string;
  headerDescription: string;
  disableTopPadding?: boolean;
  notFoundComponent: ReactNode;
  errorComponent: ReactNode;
}) {
  const { isPending, debouncedSearch, inputOnChange, search } =
    useDebouncedSearch({ time: 250 });
  const [showInput, setShowInput] = useState(true);
  return (
    <div
      className={cn(
        !disableTopPadding && "py-6",
        `container mx-auto max-w-4xl`,
      )}
    >
      {headerTitle && headerDescription && (
        <div className="mb-6">
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            {headerTitle}
          </h1>
          <p className="text-muted-foreground">{headerDescription}</p>
        </div>
      )}
      {showInput && (
        <div className="relative mb-6">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            value={search}
            onChange={inputOnChange}
            placeholder="Search for friends..."
            className="max-w-md pl-10"
          />
        </div>
      )}
      {isPending && <FriendsSkeleton countOfSkeletons={10} />}
      {!isPending && (
        <Render
          search={debouncedSearch}
          filter={filter}
          showInput={(newState: boolean) => setShowInput(newState)}
          notFoundComponent={notFoundComponent}
          errorComponent={errorComponent}
        />
      )}
    </div>
  );
}
function Render({
  search,
  filter,
  showInput,
  notFoundComponent,
  errorComponent,
}: {
  search: string;
  filter: Infer<typeof friendFilterValidator>;
  showInput: (newState: boolean) => void;
  notFoundComponent: ReactNode;
  errorComponent: ReactNode;
}) {
  const {
    data: friendList,
    error,
    isPending,
  } = useQueryWithStatus(api.friends.query.getFriendsWithSearch, {
    filter,
    search,
  });

  if (error) {
    return <>{errorComponent}</>;
  }

  if (isPending) {
    return <FriendsSkeleton countOfSkeletons={5} />;
  }

  if (friendList.length === 0) {
    return <>{notFoundComponent}</>;
  }

  return (
    <div className="space-y-3">
      {friendList.map((friend) => (
        <div key={`friend-${friend?._id}`}>
          {friend && (
            <Friend
              friend={{
                user: friend!,
                status: filter,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FriendsSkeleton({ countOfSkeletons }: { countOfSkeletons: number }) {
  return (
    <>
      {Array.from({ length: countOfSkeletons }).map((_, index) => (
        <Card key={index} className="my-3 animate-pulse">
          <CardContent className="p-4">
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
  );
}
