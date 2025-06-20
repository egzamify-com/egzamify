"use client";

import Friend from "~/components/friends/friend";
import { Button } from "~/components/ui/button";
import useFriendList from "~/hooks/use-friend-list";

export default function Page() {
  return (
    <>
      <IncomingInvites />
      <PendingInvites />
    </>
  );
}
function LoadingComponent() {
  return <div>ITS LOADING NOW ...</div>;
}
function IncomingInvites() {
  const search = "";
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
  } = useFriendList({ search, filter: "incoming_requests" });

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <div>Error loading friends: {error?.message}</div>;
  }
  if (friendList.length === 0) {
    return <p className="text-gray-500 mt-2">No incoming invites found .</p>;
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
            isFriendWithCurrentUser: false,
            showAcceptRequest: true,
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
function PendingInvites() {
  const search = "";
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
  } = useFriendList({ search, filter: "pending_requests" });

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <div>Error loading friends: {error?.message}</div>;
  }
  if (friendList.length === 0) {
    return <p className="text-gray-500 mt-2">No incoming invites found .</p>;
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
            isFriendWithCurrentUser: false,
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
