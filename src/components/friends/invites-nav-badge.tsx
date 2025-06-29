import { api } from "~/trpc/react";
import { Badge } from "../ui/badge";

export default function InvitesNavBadge() {
  const { data: incoming } = api.users.getUsersFromSearch.useQuery({
    filter: "incoming_requests",
    search: "",
    limit: 15,
  });
  const incomingRequestsCount = incoming?.items.length;

  const { data: pending } = api.users.getUsersFromSearch.useQuery({
    filter: "pending_requests",
    search: "",
    limit: 15,
  });
  const pendingRequestsCount = pending?.items.length;

  function render() {
    if (
      incomingRequestsCount === undefined ||
      pendingRequestsCount === undefined
    ) {
      return null;
    }

    if (incomingRequestsCount + pendingRequestsCount === 0) {
      return null;
    }

    if (incomingRequestsCount + pendingRequestsCount > 20) {
      return <Badge className="ml-1 ">20+</Badge>;
    } else {
      return (
        <Badge className="ml-1 ">
          {incomingRequestsCount + pendingRequestsCount}
        </Badge>
      );
    }
  }
  return <>{render()}</>;
}
