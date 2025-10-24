import { httpRouter } from "convex/server"
import { internal } from "./_generated/api"
import { type Id } from "./_generated/dataModel"
import { httpAction } from "./_generated/server"
import { auth } from "./auth"
const http = httpRouter()

auth.addHttpRoutes(http)

http.route({
  path: "/getImage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url)
    const storageId = searchParams.get("storageId")! as Id<"_storage">
    const filename = searchParams.get("filename")

    const blob = await ctx.storage.get(storageId)

    if (blob === null) {
      return new Response("Image not found", {
        status: 404,
      })
    }
    return new Response(blob, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
      status: 200,
    })
  }),
})

http.route({
  path: "/getRawImage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url)
    const storageId = searchParams.get("storageId")! as Id<"_storage">
    const blob = await ctx.storage.get(storageId)
    if (blob === null) {
      return new Response("Image not found", {
        status: 404,
      })
    }
    return new Response(blob)
  }),
})

http.route({
  path: "/polar",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!request.body) {
      return new Response("Missing request body", {
        status: 400,
      })
    }
    const rawBody = await request.text()

    const headersRecord = Object.fromEntries(request.headers.entries())

    await ctx.runAction(internal.payments.actions.handleWebhook, {
      rawBody,
      headersRecord,
      secret: process.env.POLAR_WEBHOOK_SECRET ?? "",
    })

    return new Response(null, { status: 200 })
  }),
})

export default http
