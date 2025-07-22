import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import SpinnerLoading from "../SpinnerLoading";
import { Button } from "../ui/button";

export default function AddFriend({ friendId }: { friendId: Id<"users"> }) {
  const [isPending, setIsPending] = useState(false);
  const sendFriendRequest = useMutation(api.friends.mutate.sendFriendRequest);
  return (
    <Button
      type="submit"
      onClick={() => {
        setIsPending(true);
        sendFriendRequest({ friendId });
        setIsPending(false);
      }}
    >
      {isPending ? <SpinnerLoading /> : <p>Send friend request</p>}
    </Button>
  );
}
