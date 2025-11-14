import { useQuery } from "convex-helpers/react"
import { api } from "convex/_generated/api"
import { Badge } from "../ui/badge"

export default function InvitesNavBadge() {
  const { data } = useQuery(api.friends.query.getInvitesDataForSidebar)
  if (!data) return null
  const { incomingRequestsCount, outcomingRequestsCount } = data
  function render() {
    if (
      incomingRequestsCount === undefined ||
      outcomingRequestsCount === undefined
    ) {
      return null
    }

    if (incomingRequestsCount + outcomingRequestsCount === 0) {
      return null
    }

    if (incomingRequestsCount + outcomingRequestsCount > 20) {
      return <Badge>20+</Badge>
    } else {
      return <Badge>{incomingRequestsCount + outcomingRequestsCount}</Badge>
    }
  }
  return <>{render()}</>
}
