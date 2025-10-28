import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Trash2 } from "lucide-react"
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

export default function CancelRequest({ friendId }: { friendId: Id<"users"> }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const cancelRequest = useMutation(api.friends.mutate.cancelFriendRequest)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>
          <Trash2 /> Anuluj zaproszenie
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Czy jesteś pewien?</DialogTitle>
          <DialogDescription>
            Czy napewno chesz anulować zaproszenie?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={async () => {
              setIsPending(true)
              await cancelRequest({ friendId })
              setIsPending(false)
              toast.error("Anulowano zaproszenie!")
            }}
          >
            {isPending ? (
              <SpinnerLoading />
            ) : (
              <>
                <Trash2 />
                <p>Tak, anuluj</p>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
