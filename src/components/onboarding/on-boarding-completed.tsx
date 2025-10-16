"use client"

import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export default function OnBoardingCompleted({ user }: { user: Doc<"users"> }) {
  const updateUserProfile = useMutation(api.users.mutate.updateUserProfile)
  const router = useRouter()
  return (
    <div className="flex w-1/3 flex-col items-center justify-center gap-4">
      <h1 className="text-xl">Konfiguracja konta zakończona!</h1>
      <Button
        variant="default"
        className="w-1/2"
        onClick={async () => {
          await updateUserProfile({
            newFields: { ...user, onBoarded: true },
          })
          return router.push("/")
        }}
      >
        Zacznij!
      </Button>
    </div>
  )
}
