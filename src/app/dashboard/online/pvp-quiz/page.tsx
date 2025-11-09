"use client"

import type { Id } from "convex/_generated/dataModel"
import { Users } from "lucide-react"
import { useState } from "react"
import DisplayFriendList from "~/components/friends/display-friend-list"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import { Button } from "~/components/ui/button"

export default function Page() {
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(null)
  return (
    <PageHeaderWrapper
      title="Quiz pvp"
      icon={<Users size={pageHeaderWrapperIconSize} />}
    >
      <div>
        quiz pvp page
        <p>select your friend and start quiz battle</p>
        <p>{selectedUserId}</p>
      </div>
      <DisplayFriendList
        filter="accepted_friends"
        notFoundComponent="no friends found"
        friendItemProps={{
          hideFriendButton: true,
          actionButtons: (friend) => (
            <div>
              {friend._id === selectedUserId && <p>selected</p>}
              <Button
                onClick={() => {
                  setSelectedUserId((prevUserId) => {
                    if (prevUserId === friend._id) {
                      return null
                    }
                    return friend._id
                  })
                }}
              >
                Zapros do quizu
              </Button>
            </div>
          ),
        }}
      />
    </PageHeaderWrapper>
  )
}
