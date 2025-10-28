import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import SpinnerLoading from "../spinner-loading"
import { Button } from "../ui/button"

export default function RejectRequest({ friendId }: { friendId: Id<"users"> }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const rejectRequest = useMutation(api.friends.mutate.rejectFriendRequest)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <X /> Odrzuć
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Czy jesteś pewien?</DialogTitle>
          <DialogDescription>
            Czy napewno chesz odrzucić zaproszenie?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={async () => {
              setIsPending(true)
              await rejectRequest({ friendId })
              setIsPending(false)
              toast.error("Odrzucono zaproszenie!")
            }}
          >
            {isPending ? <SpinnerLoading /> : <p>Tak, odrzuć</p>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
