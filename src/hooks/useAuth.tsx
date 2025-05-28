import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";

export default function useAuth() {
  // const router = useRouter();
  const auth = authClient.useSession();

  async function signUpWithEmail(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    failedCallback: () => void,
    succesCallback: () => void,
  ) {
    await authClient.signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      callbackURL: "/",
      fetchOptions: {
        onError: (ctx) => {
          console.log("[AUTH] Failed to sign up: ", ctx.error);
          failedCallback();
        },
        onSuccess: async (data) => {
          console.log("[AUTH] succesfully signed up: ", data);
          succesCallback();
        },
      },
    });
  }

  async function signInWithEmail(
    email: string,
    password: string,
    failedCallback: () => void,
    succesCallback: () => void,
  ) {
    await authClient.signIn.email(
      { email, password },
      {
        onError: (ctx) => {
          console.log("[AUTH] sign in error: ", ctx.error);
          failedCallback();
        },
        onSuccess: (data) => {
          console.log("[AUTH] succesfully signed in: ", data);
          succesCallback();
          // toast.success("Succesfully signed in");
          // router.push("/");
        },
      },
    );
  }

  async function logout(
    failedCallback: () => void,
    succesfullCallback: () => void,
  ) {
    await authClient.signOut({
      fetchOptions: {
        onError: (ctx) => {
          console.log("[AUTH] sign out error: ", ctx.error);
          failedCallback();
        },
        onSuccess: (data) => {
          console.log("[AUTH] succesfully signed out: ", data);
          succesfullCallback();
        },
      },
    });
  }
  return { logout, auth, signInWithEmail, signUpWithEmail };
}
