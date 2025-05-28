import { SignInButton } from "~/components/auth/SignInButton";
import authServer from "~/server/authServer";

export default async function TestPage() {
  const session = await authServer();
  console.log(session);
  return (
    <div>
      only for logged in, you can enter this page because you logged in and i
      know who you are:
      <p>{session?.user.id}</p>
      <SignInButton />
    </div>
  );
}
