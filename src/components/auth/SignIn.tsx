"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth } from "convex/react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export default function SignIn() {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()
  const { signIn } = useAuthActions()
  if (isAuthenticated) {
    router.replace("/")
  }
  return (
    <>
      <Button onClick={() => signIn("github")}>Zaloguj się z GitHub</Button>
    </>
  )
}
