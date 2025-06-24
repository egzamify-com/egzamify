import { Download, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import useDebouncedSearch from "~/hooks/use-debounced-search";
import useFriendList from "~/hooks/use-friend-list";
import { cn } from "~/lib/utils";
import type { FriendsFilter } from "~/server/api/routers/users";
import { Button } from "../ui/button";
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
  filter: FriendsFilter;
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
        `container mx-auto max-w-4xl `,
      )}
    >
      {headerTitle && headerDescription && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {headerTitle}
          </h1>
          <p className="text-muted-foreground">{headerDescription}</p>
        </div>
      )}
      {showInput && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={search}
            onChange={inputOnChange}
            placeholder="Search for friends..."
            className="pl-10 max-w-md"
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
  filter: FriendsFilter;
  showInput: (newState: boolean) => void;
  notFoundComponent: ReactNode;
  errorComponent: ReactNode;
}) {
  const {
    friendList,
    queryInfo: {
      isLoading,
      isError,
      error,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    },
  } = useFriendList({ search, filter });

  useEffect(() => {
    if (friendList.length === 0 && !search && !isLoading) {
      showInput(false);
    } else {
      showInput(true);
    }
  }, [friendList.length, search, showInput, isLoading]);

  if (isLoading) {
    return <FriendsSkeleton countOfSkeletons={10} />;
  }

  if (isError) {
    return <>{errorComponent}</>;
  }

  if (friendList.length === 0 && search) {
    return (
      <p className="text-gray-500 mt-2">No users found matching {search}.</p>
    );
  }
  if (friendList.length === 0) {
    return <>{notFoundComponent}</>;
  }

  return (
    <div>
      <div className="space-y-3">
        {friendList.map((friend) => (
          <Friend
            key={`friend-${friend?.user.id}`}
            friend={{
              user: friend.user,
              status: filter,
            }}
          />
        ))}
      </div>
      {hasNextPage && !isFetchingNextPage && (
        <div className="flex flex-col mt-6 justify-center items-center">
          <Button variant={"outline"} onClick={() => fetchNextPage()}>
            <Download />
            Load more
          </Button>
        </div>
      )}
      {isFetchingNextPage && <FriendsSkeleton countOfSkeletons={1} />}
    </div>
  );
}

function FriendsSkeleton({ countOfSkeletons }: { countOfSkeletons: number }) {
  return (
    <>
      {Array.from({ length: countOfSkeletons }).map((_, index) => (
        <Card key={index} className="animate-pulse my-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Profile Picture Skeleton */}
                <div className="relative">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background">
                    <Skeleton className="w-full h-full rounded-full" />
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
