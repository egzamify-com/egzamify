"use client"

import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { cn } from "~/lib/utils" // Assuming cn is a utility for merging class names
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tooltip, TooltipContent } from "../ui/tooltip"

interface ActivityStatusAvatarProps {
  userToShow?: Doc<"users">
  divClassname?: string

  size?: number
}

export default function ActivityStatusAvatar({
  userToShow,
  size = 32,
}: ActivityStatusAvatarProps) {
  const data = useQuery(
    api.users.query.getCurrentUser,
    userToShow ? "skip" : undefined,
  )

  const user = userToShow ?? data

  if (!user) {
    return null
  }

  const avatarSizePx = size
  const indicatorSizePx = avatarSizePx * (3 / 8)

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn("relative")}
          style={{
            width: `${avatarSizePx}px`,
            height: `${avatarSizePx}px`,
          }}
        >
          <Avatar
            className="rounded-full"
            style={{
              height: `${avatarSizePx}px`,
              width: `${avatarSizePx}px`,
            }}
          >
            <AvatarImage
              src={user.image}
              alt={`Profile picture of ${user.name}`}
            />

            <AvatarFallback className="rounded-lg">
              {`${user.username?.charAt(0) ?? ""}${user.username?.charAt(1) ?? ""}`}
            </AvatarFallback>
          </Avatar>

          <div
            className={`border-background absolute right-0 bottom-0 rounded-full border-2 ${user.isActive ? "bg-green-500" : "bg-gray-400"} `}
            style={{
              height: `${indicatorSizePx}px`,
              width: `${indicatorSizePx}px`,
            }}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{user.username}</p>
      </TooltipContent>
    </Tooltip>
  )
}
