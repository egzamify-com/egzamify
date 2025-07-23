import type { Infer } from "convex/values";
import Link from "next/link";
import { type Doc } from "~/../convex/_generated/dataModel";
import { Card, CardContent } from "~/components/ui/card";
import { friendFilterValidator } from "../../../convex/friends/query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import FriendButton from "./friend-button";
type FriendProps = {
  user: Doc<"users">;
  status?: Infer<typeof friendFilterValidator>;
  updated_at?: Date;
  created_at?: Date;
};
export default function Friend({ friend }: { friend: FriendProps }) {
  const { user, status } = friend;

  return (
    <Card
      key={`friend-card-for-${user._id}`}
      className="transition-shadow hover:shadow-md"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Profile Picture with Online Status */}
            <div className="relative">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div
                className={`border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 ${
                  true ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <Link href={`/user/${user.username}`}>
              <div>
                <h3 className="text-foreground font-medium">{user.name}</h3>
                <p className="text-muted-foreground text-sm">
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
            {/* {renderAction()} */}
            <FriendButton
              friendId={friend.user._id}
              alreadyKnownStatus={status}
            />
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
