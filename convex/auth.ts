import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import { convexAuth } from "@convex-dev/auth/server"
import { internal } from "./_generated/api"
import { type Doc } from "./_generated/dataModel"
import { internalAction } from "./_generated/server"
import { vv } from "./custom_helpers"

export type Providers = "github" | "google"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      profile(githubProfile, tokens) {
        return {
          id: String(githubProfile.id),
          name: String(githubProfile.name),
          email: githubProfile.email,
          image: githubProfile.avatar_url,
          githubId: githubProfile.id,
          githubAccessToken: tokens.access_token,
        }
      },
    }),
    Google({
      profile(googleProfile) {
        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
        }
      },
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      if (args.existingUserId) {
        console.log("this is a sign IN")
        return
      }
      console.log("this is a sign UP")
      const user: Doc<"users"> = await ctx.db.get(args.userId)
      if (!user.email) {
        console.error("[AUTH] Somehow user got signed up without email (?)")
        throw new Error("Email is required to sign up")
      }
      const defaultUsername = createDefaultUsername(user.email)
      const newData: Doc<"users"> = {
        ...user,
        username: `${defaultUsername}`,
        name: user.name === "null" ? defaultUsername : user.name,
      }
      await ctx.db.patch(args.userId, newData)
      await ctx.scheduler.runAfter(0, internal.auth.createPolarCustomer, {
        user: newData,
      })
    },
  },
})
function createDefaultUsername(inputString: string): string {
  const atIndex = inputString.indexOf("@") // Find the index of the first '@'

  if (atIndex === -1) {
    // If '@' is not found, return the original string
    return inputString
  } else {
    // If '@' is found, return the substring from the beginning up to the '@'
    return inputString.substring(0, atIndex)
  }
}
// async function sendWelcomeEmail(email: string) {
//   // Implement email sending logic here
//   console.log(`Sending welcome email to ${email}`)
// }
export const createPolarCustomer = internalAction({
  args: { user: vv.doc("users") },
  handler: async (ctx, { user }) => {
    const url = `${process.env.SITE_URL}/api/create-polar-customer`
    console.log({ url })
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
    })
  },
})
