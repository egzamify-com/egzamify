import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import type { FriendsFilter } from "~/server/api/routers/users";
import type { UserType } from "~/server/db/schema/auth.relations";
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
            <AcceptRequest friendId={user.id} />
            <RejectRequest friendId={user.id} />
          </>
        );
      case "pending_requests":
        return <CancelRequest friendId={user.id} />;
    }
  }
  return (
    <Card
      key={`friend-card-for-${user.id}`}
      className="hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Profile Picture with Online Status */}
            <div className="relative">
              <Image
                src={"/placeholder.svg"}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                  true ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <Link href={`/user/${user.username}`}>
              <div>
                <h3 className="font-medium text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {/* <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button> */}
            {renderAction()}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Block User</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <UserMinus className="h-4 w-4 mr-2" />
                  Remove Friend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
