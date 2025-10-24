import { Checkout } from "@polar-sh/nextjs"
import { env } from "~/env"

export const GET = Checkout({
  accessToken: env.POLAR_ACCESS_TOKEN,
  successUrl: env.POLAR_SUCCESS_URL,
  server: env.POLAR_SERVER,
})
