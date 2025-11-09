"use client"

import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import DisplayFriendList from "~/components/friends/display-friend-list"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import { Button } from "~/components/ui/button"
import { tryCatch } from "~/lib/tryCatch"
import { NoFriendsFound } from "../../friends/page"

export default function Page() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<Doc<"users"> | null>(null)
  const createQuiz = useMutation(api.pvp_quiz.mutate.createPvpQuiz)
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false)

  return (
    <PageHeaderWrapper
      title="Quiz pvp"
      icon={<Users size={pageHeaderWrapperIconSize} />}
    >
      <div>
        <p>select your friend and start quiz battle</p>
      </div>
      {selectedUser && (
        <Button
          onClick={async () => {
            setIsCreatingQuiz(true)

            const [battleId, err] = await tryCatch(
              createQuiz({
                opponentUserId: selectedUser._id,
              }),
            )

            setIsCreatingQuiz(false)

            if (err) {
              console.error("Failed to create pvp quiz")
              toast.error("Nie udalo sie stworzyc bitwy!")
              return
            }

            router.push(`/dashboard/online/pvp-quiz/battle/${battleId}`)
          }}
        >
          Zacznij quiz z {selectedUser?.username}
        </Button>
      )}
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
