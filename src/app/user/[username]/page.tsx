"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { useParams } from "next/navigation"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import ProfileHeader from "~/components/user-profile-page/header"

export default function Page() {
  const { username } = useParams()

  const { data, error, isPending } = useQuery(
    api.users.query.getUserFromUsername,
    {
      username: username as string,
    },
  )

  if (isPending) {
    return <FullScreenLoading loadingMessage="Loading user profile..." />
  }

  if (error) {
    return (
      <FullScreenError
        errorMessage={"Failed to load user profile"}
        errorDetail={error.message}
      />
    )
  }

  if (!data) {
    return <FullScreenError errorMessage={"User not found"} />
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <div className="w-1/2">
        <ProfileHeader info={{ user: data }} />
        {/*<Achievements />
      <UserCharts />*/}
      </div>
    </div>
  )
}
