"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import SignIn from "~/components/auth/SignIn";
import { SignUp } from "~/components/auth/SignUp";
import useAuth from "~/hooks/useAuth";
import { useRouter } from "next/navigation";

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
          <div className="md:w-[400px]">
            <Tabs defaultValue="sign-in" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="sign-in">Sign in</TabsTrigger>
                <TabsTrigger value="sign-up">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in">
                <SignIn />
              </TabsContent>
              <TabsContent value="sign-up">
                <SignUp />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
