import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import Link from "next/link"
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
  useTanstackQuery({
    queryKey: ["user", "onboarding", user._id],
    queryFn: () =>
      updateUserProfile({ newFields: { ...user, onBoarded: true } }),
  })
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
          <Link href={"/dashboard"}>
            <Button variant="outline" className="w-full">
              Zaczynamy!
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  )
}
