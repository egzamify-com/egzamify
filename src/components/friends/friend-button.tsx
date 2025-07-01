import type { FriendsFilter } from "~/server/api/routers/users";
import { api } from "~/trpc/react";
import SpinnerLoading from "../SpinnerLoading";
import AcceptRequest from "./accept-request";
import CancelRequest from "./cancel-request";
import DeleteFriend from "./delete-friend";
import RejectRequest from "./reject-request";
import SendFriendRequest from "./send-friend-request";

export default function FriendButton({
  friendId,
  alreadyKnownStatus,
}: {
  friendId: string;
  alreadyKnownStatus?: FriendsFilter;
}) {
  // console.log("alreadyKnownStatus", alreadyKnownStatus);
  // console.log("shouw run query", !alreadyKnownStatus);
  const { data, isPending, isError, error } =
    api.friends.checkFriendshipStatus.useQuery(
      { friendId },
      {
        enabled: !alreadyKnownStatus,
      },
    );

  if (isPending && !alreadyKnownStatus) {
    return (
      <div className="flex items-center justify-center">
        <SpinnerLoading />
      </div>
    );
  }
  if (isError && !alreadyKnownStatus) {
    return <div>Error: {error.message}</div>;
  }

  const friendshipStatus = alreadyKnownStatus ?? data?.status;

  function renderAction() {
    switch (friendshipStatus) {
      case "accepted_friends":
        return <DeleteFriend friendId={friendId} />;
      case "not_friends":
        return <SendFriendRequest friendId={friendId} />;
      case "incoming_requests":
        return (
          <>
            <AcceptRequest friendId={friendId} />
            <RejectRequest friendId={friendId} />
          </>
        );
      case "pending_requests":
        return <CancelRequest friendId={friendId} />;
    }
  }
  return <div>{renderAction()}</div>;
}
