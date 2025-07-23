import type { Doc } from "convex/_generated/dataModel";
import { Card, CardHeader } from "~/components/ui/card";
import FriendButton from "../friends/friend-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface HeaderProps {
  user: Doc<"users">;
}
export default function ProfileHeader({
  info: { user },
}: {
  info: HeaderProps;
}) {
  return (
    <Card>
      <CardHeader className="space-y-4 text-center">
        <Avatar className="mx-auto h-24 w-24">
          <AvatarImage src={user.image} alt="Profile picture" />
          <AvatarFallback className="text-2xl">JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name!}</h1>
          <p className="text-muted-foreground">@{user.username!}</p>
        </div>

        <FriendButton friendId={user._id} />
      </CardHeader>
    </Card>
  );
}
