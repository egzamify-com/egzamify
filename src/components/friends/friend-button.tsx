import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import type { friendFilterValidator } from "convex/friends/query";
import { useQueryWithStatus } from "convex/helpers";
import type { Infer } from "convex/values";
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
  friendId: Id<"users">;
  alreadyKnownStatus?: Infer<typeof friendFilterValidator>;
}) {
  const { data, error, isPending } = useQueryWithStatus(
    api.friends.query.checkUserFriendStatus,
    {
      friendId,
    },
  );
  if (isPending)
    return (
      <div>
        <SpinnerLoading />
      </div>
    );

  if (error) {
    return <div className="text-destructive">Error</div>;
  }

  const friendshipStatus = alreadyKnownStatus ?? data.status;

  function renderAction() {
    switch (friendshipStatus) {
      case "accepted_friends":
        return <DeleteFriend friendId={friendId} />;
      case "not_friends":
        return <SendFriendRequest friendId={friendId} />;
      case "incoming_requests":
        return (
          <div className="flex gap-2">
            <AcceptRequest friendId={friendId} />
            <RejectRequest friendId={friendId} />
          </div>
        );
      case "outcoming_requests":
        return <CancelRequest friendId={friendId} />;
    }
  }
  return <div>{renderAction()}</div>;
}
