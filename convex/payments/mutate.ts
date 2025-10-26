import { v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserProfileOrThrow } from "../custom_helpers"

export const syncUserCreditsWithPolar = mutation({
  args: { polarPurchasedCredits: v.number() },
  handler: async (ctx, { polarPurchasedCredits }) => {
    const defaultPositiveResponse = {
      ok: true,
      mess: "Twoje konto posiada prawidłową liczbę kredytów.",
    }
    if (polarPurchasedCredits === 0) return defaultPositiveResponse
    const user = await getUserProfileOrThrow(ctx)

    const dbOrderLog = await ctx.db
      .query("processedPayments")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect()

    const dbCredits = dbOrderLog.reduce(
      (accumulator, currentOrder) => accumulator + currentOrder.creditsAdded,
      0,
    )

    const diff = polarPurchasedCredits - dbCredits

    console.log({ polarPurchasedCredits })
    console.log({ dbCredits })
    console.log({ diff })
    if (diff > 0) {
      console.log(
        "less db credits that polar credits should add the diff to current user credits ",
      )
      await ctx.db.patch(user._id, { credits: (user.credits ?? 0) + diff })
      await ctx.db.insert("processedPayments", {
        userId: user._id,
        creditsAdded: diff,
        isFixingLog: Math.floor(Date.now() / 1000),
      })
      return {
        ok: false,
        mess: "Bardzo przepraszamy, że nie otrzymałeś automatycznie swoich kredytów. Dodaliśmy do twojego konta zaginione kredyty.",
      }
    }

    return defaultPositiveResponse
  },
})
