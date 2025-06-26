import { Card, CardHeader } from "~/components/ui/card";
import FriendButton from "../friends/friend-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface HeaderProps {
  username: string;
  name: string;
  userId: string;
}
export default function ProfileHeader({
  info: { username, name, userId },
}: {
  info: HeaderProps;
}) {
  return (
    <Card>
      <CardHeader className="text-center space-y-4">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage
            src="/placeholder.svg?height=96&width=96"
            alt="Profile picture"
          />
          <AvatarFallback className="text-2xl">JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground">@{username}</p>
        </div>

        <FriendButton friendId={userId} />
        {/* Action Buttons */}
        {/* <div className="flex justify-center gap-3 pt-2">
          {/* <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Friend
          </Button> */}
        {/* <Button variant="outline" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Message
          </Button> */}
        {/* <Button variant="outline" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button> */}
        {/* </div> */}
      </CardHeader>
    </Card>
  );
}
