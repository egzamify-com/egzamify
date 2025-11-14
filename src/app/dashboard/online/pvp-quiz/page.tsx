"use client"

import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Brain, GamepadIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import DisplayFriendList from "~/components/friends/display-friend-list"
import Friend from "~/components/friends/friend"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import SpinnerLoading from "~/components/spinner-loading"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { tryCatch } from "~/lib/tryCatch"
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

  const isQuizConfigReady =
    selectedUser &&
    selectedQualification.length > 0 &&
    selectedQuestionCount > 0

  async function handleCreateQuiz(finalSelectedUser: Doc<"users"> | null) {
    if (!finalSelectedUser) {
      toast.error("Wybierz przeciwnika aby rozpocząć!")
      return
    }

    if (selectedQualification.length == 0) {
      toast.error("Wybierz kwalifikacje aby rozpocząć!")
      return
    }

    if (selectedQuestionCount == 0) {
      toast.error("Wybierz liczbe pytań aby rozpocząć!")
      return
    }

    setIsCreatingQuiz(true)

    const [quizId, err] = await tryCatch(
      createQuiz({
        opponentUserId: finalSelectedUser._id,
        quizQualificationId: selectedQualification[0] as Id<"qualifications">,
        questionCount: selectedQuestionCount,
      }),
    )

    if (err) {
      const errMess = "Failed to create pvp quiz"
      console.error(errMess)
      toast.error(errMess)
      setIsCreatingQuiz(false)
      return
    }

    router.push(`/dashboard/online/pvp-quiz/game/${quizId}`)
  }

  function handleSelectNewUser(friend: Doc<"users">) {
    setSelectedUser((prevUser) => {
      if (prevUser?._id === friend._id) {
        return null
      }
      return friend
    })
  }

  return (
    <PageHeaderWrapper
      title="Konfiguracja Pojedynku"
      icon={<GamepadIcon size={pageHeaderWrapperIconSize} />}
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <Card className="w-full xl:w-1/2">
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-start gap-2">
              <Brain />
              <h1>Konfiguracja</h1>
            </CardTitle>
            <CardDescription>
              <p>Ustaw jaki quiz chcesz i z kim.</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-start gap-4">
            <div className="grid w-full grid-cols-2 gap-4">
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
            </div>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  <h2>Przeciwnik</h2>
                </CardTitle>
                <CardDescription>
                  <p className="text-muted-foreground">
                    Wybierz przeciwnika sposrod znajomych.
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <Friend
                    friend={{ user: selectedUser, hideFriendButton: true }}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Nie wybrano przeciwnika
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              className="w-full"
              onClick={async () => {
                await handleCreateQuiz(selectedUser)
              }}
            >
              {isCreatingQuiz ? <SpinnerLoading /> : <p>Zacznij quiz</p>}
            </Button>

            <div className="max-h-1/2 w-full">
              <DisplayFriendList
                fullWidthSearchBar
                filter="accepted_friends"
                friendItemProps={{
                  hideFriendButton: true,
                  actionButtons: (friend) => {
                    const isSelected = friend._id === selectedUser?._id
                    return (
                      <RadioGroup asChild>
                        <Button
                          variant={"secondary"}
                          onClick={() => {
                            console.log("button lick")
                            handleSelectNewUser(friend)
                          }}
                        >
                          <RadioGroupItem
                            value=""
                            checked={isSelected}
                            className="cursor-pointer"
                          />
                        </Button>
                      </RadioGroup>
                    )
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageHeaderWrapper>
  )
}
