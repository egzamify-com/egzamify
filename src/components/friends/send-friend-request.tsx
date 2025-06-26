import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import SpinnerLoading from "../SpinnerLoading";
import { Button } from "../ui/button";

export default function AddFriend({ friendId }: { friendId: string }) {
  const queryClient = useQueryClient();
  const { mutate: addFriend, isPending } =
    api.friends.sentFriendRequest.useMutation({
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
        toast.success("Friend request sent successfully");
      },
    });

  return (
    <Button
      type="submit"
      onClick={() => {
        addFriend({ friendId });
      }}
    >
      {isPending ? <SpinnerLoading /> : <p>Send friend request</p>}
    </Button>
  );
}
