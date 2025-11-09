"use client"

import type { Doc } from "convex/_generated/dataModel"
import { Users } from "lucide-react"
import { useState } from "react"
import DisplayFriendList from "~/components/friends/display-friend-list"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import { Button } from "~/components/ui/button"
import { NoFriendsFound } from "../../friends/page"

export default function Page() {
  const [selectedUser, setSelectedUser] = useState<Doc<"users"> | null>(null)

  return (
    <PageHeaderWrapper
      title="Quiz pvp"
      icon={<Users size={pageHeaderWrapperIconSize} />}
    >
      <div>
        quiz pvp page
        <p>select your friend and start quiz battle</p>
        <p>{selectedUser?.username}</p>
      </div>
      <DisplayFriendList
        filter="accepted_friends"
        notFoundComponent={<NoFriendsFound />}
        friendItemProps={{
          hideFriendButton: true,
          actionButtons: (friend) => (
            <div>
              {friend._id === selectedUser?._id && <p>selected</p>}
              <Button
                onClick={() => {
                  setSelectedUser((prevUser) => {
                    if (prevUser?._id === friend._id) {
                      return null
                    }
                    return friend
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
