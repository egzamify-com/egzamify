import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Check } from "lucide-react";
import { useState } from "react";
import SpinnerLoading from "../SpinnerLoading";
import { Button } from "../ui/button";

export default function AcceptRequest({ friendId }: { friendId: Id<"users"> }) {
  const [isPending, setIsPending] = useState(false);

  const acceptRequest = useMutation(api.friends.mutate.acceptFriendRequest);

  return (
    <Button
      size="sm"
      variant={"ghost"}
      className="border-2 border-green-600"
      type="submit"
      onClick={async () => {
        setIsPending(true);
        await acceptRequest({ friendId });
        setIsPending(false);
      }}
    >
      {isPending ? (
        <SpinnerLoading />
      ) : (
        <>
          <Check className="mr-1 h-4 w-4" />
          Accept
        </>
      )}
    </Button>
  );
}
