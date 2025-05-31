"use client";

import useAuth from "~/hooks/useAuth";
import { ModeToggle } from "./theme/theme-toggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavSignedIn from "./auth/NavSignedIn";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  console.log("user", user);

  if (pathname.includes("sign-in") || pathname.includes("dashboard")) {
    return null;
  }

  return (
    <nav
      className={`bg-background sticky top-0 z-50 flex h-16 w-[100vw] flex-row items-center justify-between gap-4 border-b px-4`}
    >
      <div>logo</div>
      <div className="flex gap-4">
        {!user ? <SignedOut /> : <NavSignedIn />}
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
