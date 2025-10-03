import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import SpinnerLoading from "../SpinnerLoading"
import { Button } from "../ui/button"

export default function AcceptRequest({ friendId }: { friendId: Id<"users"> }) {
  const [isPending, setIsPending] = useState(false)
  const acceptRequest = useMutation(api.friends.mutate.acceptFriendRequest)

  return (
    <Button
      size="sm"
      variant={"outline"}
      onClick={async () => {
        setIsPending(true)
        await acceptRequest({ friendId })
        setIsPending(false)
        toast.success("Friend request accepted!")
      }}
    >
      {isPending ? (
        <SpinnerLoading />
      ) : (
        <>
          <Check className="mr-1 h-4 w-4" />
          Potwierdź
        </>
      )}
    </Button>
  )
}
