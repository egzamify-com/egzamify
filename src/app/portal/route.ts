import { CustomerPortal } from "@polar-sh/nextjs"
import { env } from "~/env"

export const GET = CustomerPortal({
  accessToken: env.POLAR_ACCESS_TOKEN,
  getCustomerId: async (request) => "", // Fuction to resolve a Polar Customer ID
  server: env.POLAR_SERVER,
})
