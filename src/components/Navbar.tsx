"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ModeToggle } from "./theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.includes("sign-in") || pathname.includes("dashboard")) {
    return null;
  }

  return (
    <nav
      className={`bg-background sticky top-0 z-50 flex h-16 w-[100vw] flex-row items-center justify-end gap-4 border-b px-4`}
    >
      <div className="flex gap-4">
        <AuthLoading>
          <AuthSkeleton />
        </AuthLoading>
        <Authenticated>
          <NavSignedIn />
        </Authenticated>
        <Unauthenticated>
          <SignedOut />
        </Unauthenticated>
        <ModeToggle />
      </div>
    </nav>
  );
}

function SignedOut() {
  return (
    <div>
      <Link href={`/sign-in`}>
        <Button>Sign in</Button>
      </Link>
    </div>
  );
}

export function NavSignedIn() {
  const { signOut } = useAuthActions();
  const { data: user, isPending } = useQuery(api.users.query.getCurrentUser);
  if (isPending) {
    return <AuthSkeleton />;
  }
  if (!user) return null;
  return (
    <div className="flex gap-4">
      <Link href={"/dashboard"}>
        <Button>Dashboard</Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async () => {
              void (await signOut());
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
function AuthSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-26" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </>
  );
}
