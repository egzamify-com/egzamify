import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { Trash, Trash2 } from "lucide-react"
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

export default function DeleteFriend({ friendId }: { friendId: Id<"users"> }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const deleteFriend = useMutation(api.friends.mutate.deleteFriend)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>
          <Trash />
          Usuń znajomego
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Czy jesteś pewien?</DialogTitle>
          <DialogDescription>
            Czy napewno chcesz usunąć tego znajomego?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={async () => {
              setIsPending(true)
              await deleteFriend({ friendId })
              setIsPending(false)
              toast.error("Usunięto znajomego!")
            }}
          >
            {isPending ? (
              <SpinnerLoading />
            ) : (
              <>
                <Trash2 />
                <p> Tak, usuń znajomego</p>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
