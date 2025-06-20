import { Card } from "~/components/ui/card";
import type { UserType } from "~/server/db/schema/auth.relations";
import { formatToYYYYMMDD } from "~/utils/dateUtils";
import AcceptRequest from "./accept-request";
import AddFriend from "./add-friend";
import DeleteFriend from "./delete-friend";

type FriendProps = {
  user: UserType;
  status?: string;
  updated_at?: Date;
  created_at?: Date;
  isFriendWithCurrentUser?: boolean;
  showAcceptRequest?: boolean;
};
export default function Friend({ friend }: { friend: FriendProps }) {
  const {
    user,
    created_at,
    updated_at,
    status,
    isFriendWithCurrentUser,
    showAcceptRequest,
  } = friend;

  return (
    <Card className="m-10 p-10">
      Friend id: {user.id}
      <p>Email: {user.email}</p>
      <p>status: {status}</p>
      {updated_at && <p>updated at {formatToYYYYMMDD(updated_at)}</p>}
      {created_at && <p>created at {formatToYYYYMMDD(created_at)}</p>}
      {!isFriendWithCurrentUser ? (
        <>
          {showAcceptRequest ? (
            <>
              <AcceptRequest friendId={user.id} />
            </>
          ) : (
            <>
              <AddFriend friendId={user.id} />
            </>
          )}
        </>
      ) : (
        <DeleteFriend friendId={user.id} />
      )}
    </Card>
  );
}
