import { Card } from "~/components/ui/card";
import type { FriendsFilter } from "~/server/api/routers/users";
import type { UserType } from "~/server/db/schema/auth.relations";
import { formatToYYYYMMDD } from "~/utils/dateUtils";
import AcceptRequest from "./accept-request";
import CancelRequest from "./cancel-request";
import DeleteFriend from "./delete-friend";
import RejectRequest from "./reject-request";
import SendFriendRequest from "./send-friend-request";

type FriendProps = {
  user: UserType;
  status?: FriendsFilter;
  updated_at?: Date;
  created_at?: Date;
};
export default function Friend({ friend }: { friend: FriendProps }) {
  const { user, created_at, updated_at, status } = friend;
  function renderAction() {
    switch (status) {
      case "accepted_friends":
        return <DeleteFriend friendId={user.id} />;
      case "not_friends":
        return <SendFriendRequest friendId={user.id} />;
      case "incoming_requests":
        return (
          <>
            <RejectRequest friendId={user.id} />
            <AcceptRequest friendId={user.id} />
          </>
        );
      case "pending_requests":
        return <CancelRequest friendId={user.id} />;
    }
  }
  return (
    <Card className="m-10 p-10">
      Friend id: {user.id}
      <p>Email: {user.email}</p>
      <p>status: {status}</p>
      {updated_at && <p>updated at {formatToYYYYMMDD(updated_at)}</p>}
      {created_at && <p>created at {formatToYYYYMMDD(created_at)}</p>}
      {renderAction()}
    </Card>
  );
}
