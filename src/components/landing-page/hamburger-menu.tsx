import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { Gem, LayoutDashboard, MenuIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import ActivityStatusAvatar from "../users/activity-status-avatar"

export default function HamburgerMenu() {
  const { setTheme, theme } = useTheme()
  const userQuery = useQuery(api.users.query.getCurrentUser)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"outline"}>
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!userQuery.isPending && userQuery.data && (
          <Link href={"/dashboard/konto"}>
            <DropdownMenuItem>
              <div className="flex flex-row items-center justify-start gap-2">
                <ActivityStatusAvatar userToShow={userQuery.data} />
                <p>{userQuery.data.username}</p>
              </div>
            </DropdownMenuItem>
          </Link>
        )}
        <Link href={"/dashboard"}>
          <DropdownMenuItem>
            <LayoutDashboard />
            Dashboard
          </DropdownMenuItem>
        </Link>
        <Link href="/pricing">
          <DropdownMenuItem>
            <Gem />
            {"Doladuj konto"}
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          onClick={() => {
            if (theme === "light") {
              setTheme("dark")
              return
            } else {
              setTheme("light")
              return
            }
          }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          Motyw
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
