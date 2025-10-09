"use client"

import { useQuery } from "convex-helpers/react"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { RotateCcw, Save, Settings, User } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import SpinnerLoading from "~/components/SpinnerLoading"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group"
import { Label } from "~/components/ui/label"
import { parseConvexError } from "~/lib/utils"

export default function SettingsPage() {
  const { data: user, isPending } = useQuery(api.users.query.getCurrentUser)
  if (isPending) return <FullScreenLoading />
  if (!user)
    return <FullScreenError errorMessage="Nie znaleziono użytkownika" />

  return (
    <PageHeaderWrapper
      title="Ustawienia"
      description="Zarządzaj konfiguracją swojego konta."
      icon={<Settings size={pageHeaderWrapperIconSize} />}
    >
      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil
              </CardTitle>
              <CardDescription>
                Zaktualizuj informacje w swoim profilu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UpdateUsername {...{ user }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageHeaderWrapper>
  )
}
export function UpdateUsername({ user }: { user: Doc<"users"> }) {
  const updateProfile = useMutation(api.users.mutate.updateUsername)
  const [isMutating, setIsMutating] = useState(false)
  const [newUsername, setNewUsername] = useState(user.username)
  return (
    <InputGroup>
      <InputGroupAddon align={"inline-start"}>
        <Label>Nazwa użytkownika</Label>
      </InputGroupAddon>
      <InputGroupInput
        placeholder=""
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={() => setNewUsername(user.username)}>
          <RotateCcw /> Reset
        </InputGroupButton>
        <InputGroupButton
          variant={"default"}
          disabled={newUsername === user.username}
          onClick={async () => {
            try {
              if (!newUsername) throw new Error("Podaj nazwę użytkownika")
              setIsMutating(true)
              await updateProfile({ newUsername })
              setIsMutating(false)
              toast.success("Zmieniono nazwę użytkownika")
            } catch (error) {
              setIsMutating(false)
              const errMess = parseConvexError(error)
              console.error(`[ERROR] Failed to change username -  ${errMess}`)
              toast.error("Nie udało się zmienić nazwy użytkownika", {
                description: errMess,
              })
            }
          }}
        >
          {isMutating ? (
            <SpinnerLoading />
          ) : (
            <>
              <Save /> Zapisz
            </>
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
