import { createAuthClient } from "better-auth/react";
import { env } from "~/env";
import { usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [usernameClient()],
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
