"use client"

import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import DisplayFriendList from "~/components/friends/display-friend-list"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import SpinnerLoading from "~/components/spinner-loading"
import { Button } from "~/components/ui/button"
import { tryCatch } from "~/lib/tryCatch"
import { NoFriendsFound } from "../../friends/page"
import SelectQualificationForPvpQuiz from "./(components)/select-qualification-for-pvp-quiz"
import SelectQuestionCount from "./(components)/select-question-count"

export default function Page() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<Doc<"users"> | null>(null)
  const createQuiz = useMutation(api.pvp_quiz.mutate.createPvpQuiz)
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false)
  const [selectedQualification, setSelectedQualifaction] = useState<string[]>(
    [],
  )
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(0)

  const isQuizConfigReady = selectedUser && selectedQualification.length > 0

  async function handleCreateQuiz(finalSelectedUser: Doc<"users">) {
    setIsCreatingQuiz(true)

    const [battleId, err] = await tryCatch(
      createQuiz({
        opponentUserId: finalSelectedUser._id,
        quizQualificationId: selectedQualification[0] as Id<"qualifications">,
        questionCount: selectedQuestionCount,
      }),
    )

    setIsCreatingQuiz(false)

    if (err) {
      const errMess = "Failed to create pvp quiz"
      console.error(errMess)
      toast.error(errMess)
      return
    }

    router.push(`/dashboard/online/pvp-quiz/battle/${battleId}`)
  }

  return (
    <PageHeaderWrapper
      title="Quiz pvp"
      icon={<Users size={pageHeaderWrapperIconSize} />}
    >
      <div>
        <p>select your friend and start quiz battle</p>
      </div>
      {isQuizConfigReady && (
        <Button onClick={async () => await handleCreateQuiz(selectedUser)}>
          {isCreatingQuiz ? (
            <>
              <SpinnerLoading />
            </>
          ) : (
            <p>Zacznij quiz z {selectedUser.username}</p>
          )}
        </Button>
      )}
      {selectedQualification}
      {selectedQuestionCount}
      <SelectQualificationForPvpQuiz
        {...{
          selectedQualification,
          handleNewQualification: (newQualificationArr) =>
            setSelectedQualifaction(newQualificationArr),
        }}
      />
      <SelectQuestionCount
        {...{ selectedQuestionCount, setSelectedQuestionCount }}
      />

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
