import { auth } from "@clerk/nextjs/server";

export default async function TestPage() {
  const currentUser = await auth();

  return (
    <div>
      only for logged in, you can enter this page because you logged in and i
      know who you are:
      <p>{currentUser.userId},</p>
    </div>
  );
}
