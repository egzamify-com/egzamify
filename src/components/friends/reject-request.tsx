import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { X } from "lucide-react";
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

export default function RejectRequest({ friendId }: { friendId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: rejectRequest, isPending } =
    api.friends.cancelRequest.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        void queryClient.invalidateQueries({
          queryKey: getQueryKey(
            api.users.getUsersFromSearch,
            undefined,
            "infinite",
          ),
        });
        setDialogOpen(false);
        toast.success("Friend request rejected successfully");
      },
    });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="border-2 border-destructive "
        >
          <X className="h-4 w-4 mr-1" />
          Decline
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
            onClick={() => {
              rejectRequest({ friendId });
            }}
          >
            {isPending ? <SpinnerLoading /> : <p>Yes, cancel</p>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
