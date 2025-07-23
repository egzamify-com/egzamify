import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function SignIn() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const { signIn, signOut } = useAuthActions();
  if (isAuthenticated) {
    router.push("/");
  }
  return (
    <>
      <Button onClick={() => void signIn("github")}>Sign in with GitHub</Button>
    </>
  );
}
