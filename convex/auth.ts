import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

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
});
