import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { toast } from "sonner"
import SpinnerLoading from "~/components/spinner-loading"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { useReactToQuizInvite } from "./invite-card"

export default function OnlineInvitesSidebarBadge() {
  const { data } = useQuery(api.pvp_quiz.query.getOnlineInvites)

  const { acceptQuiz, isAccepting } = useReactToQuizInvite(
    data?.[data.length - 1]?._id,
  )

  if (data && data.length > 0) {
    toast.info("Otrzymaleś zaproszenie do quizu!", {
      action: (
        <Button
          onClick={async () => {
            await acceptQuiz()
            toast.dismiss()
          }}
        >
          {isAccepting ? <SpinnerLoading /> : <>Rozpocznij</>}
        </Button>
      ),
    })
  }

  return (
    <>
      {data && data.length !== 0 && (
        <>
          {data.length > 20 && <Badge>20+</Badge>}
          {data.length < 20 && <Badge>{data.length}</Badge>}
        </>
      )}
    </>
  )
}
