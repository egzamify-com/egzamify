import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";
import { Doc } from "./_generated/dataModel";

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
        };
      },
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      const { userId } = args;

      const user: Doc<"users"> = await ctx.db.get(userId);
      console.log("freshly signed up user -", user);
      const defaultUsername = createDefaultUsername(user.email!);

      await ctx.db.patch(userId, {
        username: `${defaultUsername}`,
        name: user.name === "null" ? defaultUsername : user.name,
      });
    },
  },
});
function createDefaultUsername(inputString: string): string {
  const atIndex = inputString.indexOf("@"); // Find the index of the first '@'

  if (atIndex === -1) {
    // If '@' is not found, return the original string
    return inputString;
  } else {
    // If '@' is found, return the substring from the beginning up to the '@'
    return inputString.substring(0, atIndex);
  }
}
