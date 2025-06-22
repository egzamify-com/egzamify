import { useEffect, useState } from "react";
import useDebouncedSearch from "~/hooks/use-debounced-search";
import useFriendList from "~/hooks/use-friend-list";
import type { FriendsFilter } from "~/server/api/routers/users";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Friend from "./friend";

export default function DisplayFriendList({
  filter,
}: {
  filter: FriendsFilter;
}) {
  const { isPending, debouncedSearch, inputOnChange, search } =
    useDebouncedSearch({ time: 250 });
  const [showInput, setShowInput] = useState(true);
  return (
    <>
      {showInput && <Input value={search} onChange={inputOnChange}></Input>}
      {isPending && <LoadingComponent />}
      {!isPending && (
        <Render
          search={debouncedSearch}
          filter={filter}
          updateInput={(newState: boolean) => setShowInput(newState)}
        />
      )}
    </>
  );
}
function Render({
  search,
  filter,
  updateInput,
}: {
  search: string;
  filter: FriendsFilter;
  updateInput: (newState: boolean) => void;
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
    if (friendList.length === 0 && !search) {
      updateInput(false);
    } else {
      updateInput(true);
    }
  }, [friendList.length, search, updateInput]);

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
  if (friendList.length === 0) {
    return <p className="text-gray-500 mt-2">No {filter} invites found .</p>;
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
export function LoadingComponent() {
  return <div>ITS LOADING NOW ...</div>;
}
