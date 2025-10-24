import type { Doc } from "convex/_generated/dataModel"
import { NextResponse, type NextRequest } from "next/server"
import { tryCatch } from "~/lib/tryCatch"
import { polarApi } from "~/server/polar"

// email is never null, its checked on user creation,
// the schema just requires it to be optional, thats why assertion is here
export async function POST(req: NextRequest) {
  const [res, parseErr] = await tryCatch(
    (async () => {
      return await req.json()
    })(),
  )
  if (parseErr) {
    const mess =
      "[POLAR] Failed to create polar customer - no user found in the body"
    console.error(mess)
    throw new Error(mess)
  }

  const user: Doc<"users"> = res

  if (!user) {
    const mess = "[POLAR] Failed to create polar customer"
    console.error(mess)
    throw new Error(mess)
  }
  console.log({ user })
  const { _id, email, name } = user

  const [, err] = await tryCatch(
    (async () => {
      await polarApi.customers.create({
        email: email!,
        externalId: _id,
        name: name,
      })
    })(),
  )
  if (err) {
    const mess = `[POLAR] Failed to create polar customer - ${err}`
    console.error(mess)
    throw new Error(mess)
  }
  console.log("[POLAR] created polar customer")
  return new NextResponse("ok")
}
