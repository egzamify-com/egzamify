import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { toast } from "sonner"
import { Badge } from "~/components/ui/badge"

export default function OnlineInvitesSidebarBadge() {
  const { data } = useQuery(api.pvp_quiz.query.getOnlineInvites)

  function render() {
    if (!data) return null

    if (data?.length === 0) {
      return null
    }

    if (data.length > 20) {
      return <Badge>20+</Badge>
    } else {
      toast.success("Otrzymano zaproszenie do quizu online!")
      return <Badge>{data.length}</Badge>
    }
  }
  return <>{render()}</>
}
