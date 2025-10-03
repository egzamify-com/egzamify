"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex-helpers/react"
import { api } from "convex/_generated/api"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import Feedbackbtn from "./feedback-btn"
import { ModeToggle } from "./theme/theme-toggle"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import ActivityStatusAvatar from "./users/activity-status-avatar"

export default function Navbar() {
  const pathname = usePathname()
  if (pathname.includes("sign-in") || pathname.includes("dashboard")) {
    return null
  }

  return (
    <nav
      className={`bg-background sticky top-0 z-50 flex h-16 w-[100vw] flex-row items-center justify-between gap-4 border-b px-4`}
    >
      <div>
        <h1 className="text-3xl font-extrabold">Egzamify</h1>
      </div>
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
        <div className="flex flex-row items-center justify-center gap-2">
          <ModeToggle />
          <Feedbackbtn />
        </div>
      </div>
    </nav>
  )
}

function SignedOut() {
  return (
    <Link href={`/sign-in`}>
      <Button>Zaloguj się</Button>
    </Link>
  )
}

export function NavSignedIn() {
  const { signOut } = useAuthActions()
  const { data: user, isPending } = useQuery(api.users.query.getCurrentUser)
  const router = useRouter()
  if (isPending) {
    return <AuthSkeleton />
  }
  if (!user) return null
  return (
    <div className="flex gap-4">
      <Link href={"/dashboard"}>
        <Button>Dashboard</Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ActivityStatusAvatar userToShow={user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              await signOut()
              console.log("[AUTH] succesfully signed out")
              toast.success("Succefully loged out")
              router.replace("/")
            }}
          >
            <LogOut color="red" />
            Wyloguj się
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
function AuthSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-26" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </>
  )
}
