"use client"

import { useQuery } from "convex-helpers/react"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { Settings, User } from "lucide-react"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import UpdateQualifications from "~/components/settings/update-qualifications"
import UpdateUsername from "~/components/settings/update-username"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"

export default function SettingsPage() {
  const { data: user, isPending } = useQuery(api.users.query.getCurrentUser)
  if (isPending) return <FullScreenLoading />
  if (!user)
    return <FullScreenError errorMessage="Nie znaleziono użytkownika" />

  return (
    <PageHeaderWrapper
      title="Ustawienia"
      description="Zarządzaj konfiguracją swojego konta."
      icon={<Settings />}
    >
      <div className="bg-background min-h-screen">
        <ProfileSection {...{ user }} />
      </div>
    </PageHeaderWrapper>
  )
}
function ProfileSection({ user }: { user: Doc<"users"> }) {
  return (
    <div className="container mx-auto flex max-w-4xl flex-col gap-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={22} />
            <h1 className="text-xl">Profil</h1>
          </CardTitle>
          <CardDescription>
            Zaktualizuj informacje o swoim profilu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <UpdateUsername {...{ user }} />
          <Separator />
          <UpdateQualifications {...{ user }} />
        </CardContent>
      </Card>
    </div>
  )
}
