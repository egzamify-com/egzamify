import { authClient } from "~/lib/auth-client";

export default function useAuth() {
  const auth = authClient.useSession();
  const error = auth.error;
  const user = auth.data?.user;
  const session = auth.data?.session;

  return { auth, error, user, session };
}
