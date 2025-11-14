"use server"

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "convex/_generated/api"
import { fetchMutation, fetchQuery } from "convex/nextjs"

export async function getNextjsUserOrThrow() {
  const user = await fetchQuery(
    api.users.query.getCurrentUser,
    {},
    { token: await convexAuthNextjsToken() },
  )
  if (!user) {
    throw new Error("Failed to get current user in app server")
  }
  return user
}

export async function chargeCredits(creditsToCharge: number) {
  const result = await fetchMutation(
    api.users.mutate.chargeCreditsOrThrow,
    {
      creditsToCharge,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  )
  if (result.message === "user has enough credits") {
    console.log("User got charged successfully")
    return true
  }
  if (result.message === "user DOESNT have enough credits") {
    console.log("User doesnt have enough credits")
    return false
  }
  return false
}

export async function refundCredits(creditsToRefund: number) {
  console.log("Refunding user credits")
  await fetchMutation(
    api.users.mutate.updateUserCredits,
    {
      creditsToAdd: creditsToRefund,
    },
    {
      token: await convexAuthNextjsToken(),
    },
  )
  console.log("Successfully refunded user credits")
}
