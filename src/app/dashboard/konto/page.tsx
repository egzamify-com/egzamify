"use client"

import { useQuery } from "convex-helpers/react"
import { api } from "convex/_generated/api"
import { Settings, User } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import SpinnerLoading from "~/components/SpinnerLoading"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"

export default function Page() {
  const {
    data: user,
    error,
    isPending,
  } = useQuery(api.users.query.getCurrentUser)

  if (isPending) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <SpinnerLoading />
      </div>
    )
  }
  if (!user || error) return redirect("/sign-in")

  return (
    <div className="space-y-6 px-10 pt-10">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <ActivityStatusAvatar userToShow={user} size={50} />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
            </div>

            <Link href={`/user/${user.username}`}>
              <Button variant={"outline"}>
                <User /> Profil publiczny
              </Button>
            </Link>
            <Link href={"/dashboard/settings"}>
              <Button variant={"outline"}>
                <Settings /> Ustawienia
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
