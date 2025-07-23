"use client";

import { api } from "convex/_generated/api";
import { useQueryWithStatus } from "convex/helpers";
import { redirect } from "next/navigation";
import SpinnerLoading from "~/components/SpinnerLoading";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import UpdateProfileDialog from "./UpdateProfile";

export default function Page() {
  const {
    data: user,
    error,
    isPending,
  } = useQueryWithStatus(api.users.query.getCurrentUser);

  if (isPending) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <SpinnerLoading />
      </div>
    );
  }
  if (!user || error) return redirect("/sign-in");

  return (
    <div className="space-y-6 px-10 pt-10">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src="/placeholder.svg?height=80&width=80"
                alt="Profile picture"
              />
              <AvatarFallback className="text-lg font-semibold">
                AS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <UpdateProfileDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
