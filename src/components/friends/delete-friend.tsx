import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Trash } from "lucide-react";
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
import { api } from "~/trpc/react";
import SpinnerLoading from "../SpinnerLoading";
import { Button } from "../ui/button";

export default function DeleteFriend({ friendId }: { friendId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteFriend, isPending } =
    api.friends.deleteFriend.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        void queryClient.invalidateQueries({
          queryKey: getQueryKey(api.users),
        });
        void queryClient.invalidateQueries({
          queryKey: getQueryKey(api.friends),
        });
        setDialogOpen(false);
      },
    });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>
          <Trash />
          Delete Friend
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            friend.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteFriend({ friendId });
            }}
          >
            {isPending ? <SpinnerLoading /> : <p>Yes, delete</p>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
