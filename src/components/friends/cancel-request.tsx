import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
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

export default function CancelRequest({ friendId }: { friendId: Id<"users"> }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const cancelRequest = useMutation(api.friends.mutate.cancelFriendRequest);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Cancel request</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete friend
            request.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={async () => {
              setIsPending(true);
              await cancelRequest({ friendId });
              setIsPending(false);
              toast.error("Friend request cancelled");
            }}
          >
            {isPending ? <SpinnerLoading /> : <p>Yes, cancel</p>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
