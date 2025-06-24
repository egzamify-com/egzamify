import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import SpinnerLoading from "../SpinnerLoading";
import { Button } from "../ui/button";

export default function AcceptRequest({ friendId }: { friendId: string }) {
  const queryClient = useQueryClient();
  const { mutate: addFriend, isPending } =
    api.friends.acceptRequest.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        void (await queryClient.invalidateQueries({
          queryKey: getQueryKey(
            api.users.getUsersFromSearch,
            undefined,
            "infinite",
          ),
        }));
      },
    });

  return (
    <Button
      size="sm"
      variant={"ghost"}
      className="border-2 border-green-600"
      type="submit"
      onClick={() => {
        addFriend({ friendId });
      }}
    >
      {isPending ? (
        <SpinnerLoading />
      ) : (
        <>
          <Check className="h-4 w-4 mr-1" />
          Accept
        </>
      )}
    </Button>
  );
}
