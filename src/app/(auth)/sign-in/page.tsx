"use client";

import { useRouter } from "next/navigation";
import SignIn from "~/components/auth/SignIn";
import useAuth from "~/hooks/useAuth";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  if (user) {
    return router.push("/");
  }
  if (!user) {
    return (
      <div className="w-full">
        <div className="flex w-full flex-col items-center justify-center md:py-10">
          <SignIn />
        </div>
      </div>
    );
  }
}
