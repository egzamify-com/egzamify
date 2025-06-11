"use client";

import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import { authClient } from "~/lib/auth-client";
import UpdateProfileDialog from "./UpdateProfile";

export default function Page() {
  const auth = authClient.useSession();
  const user = auth.data?.user;
  if (!user && !auth.isPending) return redirect("/sign-in");

  return (
    <div className="pt-10 px-10 space-y-6">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src="/placeholder.svg?height=80&width=80"
                alt="Profile picture"
              />
              <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                AS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>
            <UpdateProfileDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
