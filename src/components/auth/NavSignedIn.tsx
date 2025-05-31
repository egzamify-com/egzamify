import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authClient } from "~/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

export default function NavSignedIn() {
  return (
    <div className="flex gap-4">
      <Link href={"/dashboard"}>
        <Button>Dashboard</Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onError: (ctx) => {
                    console.log("[AUTH] sign out error: ", ctx.error);
                    toast.error("Failed to logout");
                  },
                  onSuccess: (data) => {
                    console.log("[AUTH] succesfully signed out: ", data);
                    toast.success("Succefully loged out");
                  },
                },
              });
            }}
          >
            <LogOut color="red" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
