"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex-helpers/react"
import { api } from "convex/_generated/api"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import posthog from "posthog-js"
import { useEffect } from "react"
import { toast } from "sonner"
import { APP_CONFIG } from "~/APP_CONFIG"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import DashboardBtn from "./landing-page/dashboard-btn"
import GetCreditsBtn from "./landing-page/get-credits-btn"
import HamburgerMenu from "./landing-page/hamburger-menu"
import LogInBtn from "./landing-page/log-in-btn"
import SpinnerLoading from "./spinner-loading"
import { ModeToggle } from "./theme/theme-toggle"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import ActivityStatusAvatar from "./users/activity-status-avatar"

export default function Navbar() {
  const user = useQuery(api.users.query.getCurrentUser)

  useEffect(() => {
    console.log("this should run once ever")
    if (!user.data) {
      posthog.reset(true)
      return
    }

    posthog.identify(user.data._id, {
      name: user.data.name,
      email: user.data.email,
    })
  }, [user.data?._id])

  const pathname = usePathname()

  if (
    APP_CONFIG.navbarDisplay.blockNavbarSitesArr.some((segment: string) =>
      pathname.includes(segment),
    )
  ) {
    return null
  }

  return (
    <nav
      className={`bg-background sticky top-0 z-50 flex h-16 w-screen flex-row items-center justify-between px-4`}
    >
      <Link href={"/"}>
        <div className="relative flex flex-row items-start justify-start gap-2">
          <h1 className="logo-font">Egzamify</h1>
          <Badge
            variant={"outline"}
            className="absolute top-2 right-[-55px] rounded-xl"
          >
            <p className="">Beta</p>
          </Badge>
        </div>
      </Link>
      <div className="flex sm:hidden">
        <HamburgerMenu />
      </div>
      <div className="hidden gap-4 sm:flex">
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
        </div>
      </div>
    </nav>
  )
}

function SignedOut() {
  return (
    <div className="flex flex-row gap-4">
      <GetCreditsBtn />
      <LogInBtn size="sm" className="h-9" />
    </div>
  )
}

export function NavSignedIn() {
  const { signOut } = useAuthActions()
  const { data: user, isPending } = useQuery(api.users.query.getCurrentUser)
  const router = useRouter()
  const pathname = usePathname()
  if (isPending) {
    return <AuthSkeleton />
  }
  if (!user) return null

  if (!user.onBoarded && !pathname.includes("/welcome")) {
    router.push("/welcome")
    return <SpinnerLoading />
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <GetCreditsBtn />
      <DashboardBtn />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ActivityStatusAvatar userToShow={user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              await signOut()
              toast.success("Wylogowano")
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
      <Skeleton className="h-10 w-26" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </>
  )
}
