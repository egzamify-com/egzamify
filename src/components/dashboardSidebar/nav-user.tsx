"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import { useQueryWithStatus } from "convex/helpers";
import { useConvexAuth } from "convex/react";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { authClient } from "~/lib/auth-client";
import SpinnerLoading from "../SpinnerLoading";
import ActivityStatusAvatar from "../users/activity-status-avatar";

export function NavUser() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { isAuthenticated } = useConvexAuth();
  const {
    data: user,
    error,
    isPending,
  } = useQueryWithStatus(api.users.query.getCurrentUser);

  const { setTheme, theme } = useTheme();
  if (!isAuthenticated || !user) return null;
  if (isPending) return <SpinnerLoading />;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <ActivityStatusAvatar userToShow={user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.username}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.name} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <Link href={"/dashboard/konto"}>
              <DropdownMenuItem className="cursor-pointer">
                <User />
                Konto
              </DropdownMenuItem>
            </Link>
            {theme === "dark" ? (
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="cursor-pointer"
              >
                <Sun />
                Light Theme
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="cursor-pointer"
              >
                <Moon />
                Dark Theme
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="cursor-pointer"
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
                      history.replaceState(null, "", "/");
                      router.push("/");
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
