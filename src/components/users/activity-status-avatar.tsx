"use client";

import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ActivityStatusAvatar({
  userToShow,
}: {
  userToShow?: Doc<"users">;
}) {
  const data = useQuery(
    api.users.query.getCurrentUser,
    userToShow ? "skip" : undefined,
  );

  const user = userToShow ?? data;
  if (!user) return null;

  return (
    <div className="relative">
      <Avatar className="h-8 w-8 rounded-full">
        <AvatarImage src={user.image} alt={`Profile picture of ${user.name}`} />
        <AvatarFallback className="rounded-lg">
          {`${user.username?.charAt(0)}${user.username?.charAt(1)}`}
        </AvatarFallback>
      </Avatar>
      <div
        className={`border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 ${
          user.isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
    </div>
  );
}
