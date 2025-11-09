import type { friendFilterValidator } from "convex/friends/helpers"
import type { Infer } from "convex/values"
import Link from "next/link"
import type { ReactNode } from "react"
import { type Doc } from "~/../convex/_generated/dataModel"
import { Card, CardContent } from "~/components/ui/card"
import ActivityStatusAvatar from "../users/activity-status-avatar"
import FriendButton from "./friend-button"

export type FriendProps = {
  user?: Doc<"users">
  status?: Infer<typeof friendFilterValidator>
  updated_at?: Date
  created_at?: Date
  hideFriendButton?: boolean
  actionButtons: (friend: Doc<"users">) => ReactNode
}
export default function Friend({ friend }: { friend: FriendProps }) {
  if (!friend) return null
  if (!friend.user) return null
  const { user, status, hideFriendButton, actionButtons } = friend
  const renderedActionButtons =
    typeof actionButtons === "function" ? actionButtons(user) : actionButtons
  return (
    <Card
      key={`friend-card-for-${user._id}`}
      className="transition-shadow hover:shadow-md"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ActivityStatusAvatar userToShow={user} />

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
            {renderedActionButtons}
            {!hideFriendButton && (
              <FriendButton
                friendId={friend.user._id}
                alreadyKnownStatus={status}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
