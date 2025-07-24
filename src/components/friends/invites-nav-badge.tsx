import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { Badge } from "../ui/badge";

export default function InvitesNavBadge() {
  const { data: incomingRequests } = useQuery(
    api.friends.query.getFriendsWithSearch,
    {
      filter: "incoming_requests",
      search: "",
    },
  );
  const incomingRequestsCount = incomingRequests?.length ?? 0;

  const { data: outcomingRequests } = useQuery(
    api.friends.query.getFriendsWithSearch,
    {
      filter: "outcoming_requests",
      search: "",
    },
  );

  const outcomingRequestsCount = outcomingRequests?.length ?? 0;

  function render() {
    if (
      incomingRequestsCount === undefined ||
      outcomingRequestsCount === undefined
    ) {
      return null;
    }

    if (incomingRequestsCount + outcomingRequestsCount === 0) {
      return null;
    }

    if (incomingRequestsCount + outcomingRequestsCount > 20) {
      return <Badge className="ml-1">20+</Badge>;
    } else {
      return (
        <Badge className="ml-1">
          {incomingRequestsCount + outcomingRequestsCount}
        </Badge>
      );
    }
  }
  return <>{render()}</>;
}
