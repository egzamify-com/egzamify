import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import SpinnerLoading from "../SpinnerLoading";
import { Button } from "../ui/button";

export default function RejectRequest({ friendId }: { friendId: Id<"users"> }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const rejectRequest = useMutation(api.friends.mutate.rejectFriendRequest);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <X /> Decline
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={async () => {
              setIsPending(true);
              await rejectRequest({ friendId });

              setIsPending(false);
            }}
          >
            {isPending ? <SpinnerLoading /> : <p>Yes, reject</p>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
