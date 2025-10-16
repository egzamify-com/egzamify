import type { Doc } from "convex/_generated/dataModel"
import { Card, CardHeader } from "~/components/ui/card"
import FriendButton from "../friends/friend-button"
import ActivityStatusAvatar from "../users/activity-status-avatar"

export default function ProfileHeader({
  info: { user },
}: {
  info: { user: Doc<"users"> }
}) {
  return (
    <Card className="w-full border-0 bg-transparent">
      <CardHeader className="flex flex-col items-center justify-center gap-4">
        <ActivityStatusAvatar userToShow={user} size={90} />
        <div className="text-center">
          <h1 className="text-2xl font-bold">{user.name!}</h1>
          <p className="text-muted-foreground">@{user.username!}</p>
        </div>

        <FriendButton friendId={user._id} />
      </CardHeader>
    </Card>
  )
}
