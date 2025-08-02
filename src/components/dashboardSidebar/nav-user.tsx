"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Skeleton } from "../ui/skeleton";
import ActivityStatusAvatar from "../users/activity-status-avatar";

export function NavUser() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isMobile } = useSidebar();
  const {
    data: user,
    error,
    isPending,
  } = useQuery(api.users.query.getCurrentUser);

  const { setTheme, theme } = useTheme();
  if (isPending) return <Loading />;
  if (!user) return null;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isPending ? (
                <>kfjdls</>
              ) : (
                <>
                  <ActivityStatusAvatar userToShow={user} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.username}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </>
              )}
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
                <ActivityStatusAvatar userToShow={user} />
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
            <Link href={"/dashboard/settings"}>
              <DropdownMenuItem className="cursor-pointer">
                <Settings />
                Settings
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
                await signOut();
                console.log("[AUTH] succesfully signed out");
                toast.success("Succefully loged out");
                router.replace("/");
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
function Loading() {
  return (
    <div className="flex items-center space-x-3 rounded-md p-2">
      <Skeleton className="h-10 w-10 rounded-full" />{" "}
      <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
        <Skeleton className="h-4 w-3/4 rounded-md" />{" "}
        <Skeleton className="h-3 w-1/2 rounded-md" />{" "}
      </div>
      <Skeleton className="ml-auto h-4 w-4 rounded-md" />{" "}
    </div>
  );
}
