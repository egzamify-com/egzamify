"use client"

import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

export default function OnBoardingCompleted({ user }: { user: Doc<"users"> }) {
  const updateUserProfile = useMutation(api.users.mutate.updateUserProfile)
  const router = useRouter()
  return (
    <>
      <Card className="w-2/5">
        <CardHeader>
          <CardTitle>
            <h1>Konfiguracja konta zakończona!</h1>
          </CardTitle>
          <CardDescription>
            <p>Teraz możesz zacząć naukę!</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await updateUserProfile({
                newFields: { ...user, onBoarded: true },
              })
              return router.push("/")
            }}
          >
            Zaczynamy!
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
