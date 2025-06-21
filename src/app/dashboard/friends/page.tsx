"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useDebouncedSearch from "~/hooks/use-debounced-search";
import useFriendList from "~/hooks/use-friend-list";
import type { FriendsFilter } from "~/server/api/routers/users";
import Friend from "../../../components/friends/friend";

export default function Page() {
  const { isPending, debouncedSearch, inputOnChange, search } =
    useDebouncedSearch({ time: 250 });

  return (
    <>
      <Input value={search} onChange={inputOnChange}></Input>
      {isPending && <LoadingComponent />}
      {!isPending && <FriendsList search={debouncedSearch} />}
    </>
  );
}

function FriendsList({ search }: { search: string }) {
  const filter: FriendsFilter = "accepted_friends";
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

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <div>Error loading friends: {error?.message}</div>;
  }

  if (friendList.length === 0 && search) {
    return (
      <p className="text-gray-500 mt-2">No friends found matching {search}.</p>
    );
  }
  return (
    <div>
      {friendList.map((potentialFriend) => (
        <Friend
          key={`potentialFriend-${potentialFriend?.user.id}`}
          friend={{
            user: potentialFriend.user,
            status: filter,
          }}
        />
      ))}
      {hasNextPage && !isFetchingNextPage && (
        <Button onClick={() => fetchNextPage()}>Load more</Button>
      )}
      {isFetchingNextPage && <LoadingComponent />}
    </div>
  );
}
function LoadingComponent() {
  return <div>ITS LOADING NOW ...</div>;
}
