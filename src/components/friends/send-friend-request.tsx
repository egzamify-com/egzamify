import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import SpinnerLoading from "../spinner-loading"
import { Button } from "../ui/button"

export default function AddFriend({ friendId }: { friendId: Id<"users"> }) {
  const [isPending, setIsPending] = useState(false)
  const sendFriendRequest = useMutation(api.friends.mutate.sendFriendRequest)
  return (
    <Button
      type="submit"
      onClick={() => {
        setIsPending(true)
        sendFriendRequest({ friendId })
        setIsPending(false)
        toast.success("Friend request sent!")
      }}
    >
      {isPending ? (
        <SpinnerLoading />
      ) : (
        <>
          <UserPlus />
          <p>Zaproś do znajomych</p>
        </>
      )}
    </Button>
  )
}
