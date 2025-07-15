"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
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
