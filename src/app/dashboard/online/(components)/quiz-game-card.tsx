"use client"

import type { Doc } from "convex/_generated/dataModel"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { cloneElement, type ReactElement, type ReactNode } from "react"
import SemanticDate from "~/components/semantic-date"
import { Card } from "~/components/ui/card"
import ActivityStatusAvatar from "~/components/users/activity-status-avatar"
import { cn } from "~/lib/utils"

type CardBadge = {
  badgeText?: string
  badgeIcon?: ReactNode
}

export interface OnlineModeCardProps {
  mainIcon: ReactElement
  title: string
  description: string
  qualification?: string
  badges?: CardBadge[]
  bigBgText?: string
  href: string
  primaryActionText?: string
  historyData?: {
    opponentUser: Doc<"users">
    didCurrentUserWon: boolean
    creationTime: number
  }
}

export function OnlineModeCard({
  title,
  description,
  qualification,
  badges,
  bigBgText,
  href,
  primaryActionText,
  mainIcon,
  historyData,
}: OnlineModeCardProps) {
  return (
    <>
      {/* @ts-expect-error fjdks */}
      <Link href={href} className="w-full">
        <motion.div
          className={cn(
            `border-border hover:border-primary relative flex min-h-[280px] w-full flex-col overflow-hidden rounded-xl border p-0 transition-all duration-300`,
            historyData && historyData.didCurrentUserWon && "border-green-500",
            historyData &&
              !historyData.didCurrentUserWon &&
              "border-destructive",
          )}
        >
          <Card className="p-8">
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="bg-primary/10 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl" />
              <div className="bg-accent/10 absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="bg-primary/20 border-primary rounded-xl border-2 p-3"
                  >
                    {/* @ts-expect-error fjdks */}
                    {cloneElement(mainIcon, { className: "h-8 w-8" })}
                  </motion.div>
                  {qualification && (
                    <span className="bg-accent/20 text-accent border-accent/30 rounded-full border px-3 py-1 text-sm font-medium">
                      {qualification}
                    </span>
                  )}
                  {historyData && (
                    <p
                      className={cn(
                        "text-2xl font-semibold",
                        historyData.didCurrentUserWon
                          ? "text-green-500"
                          : "text-destructive",
                      )}
                    >
                      {historyData.didCurrentUserWon
                        ? "Zwycięstwo"
                        : "Przegrana"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6 flex-1">
                <h3 className="text-foreground group-hover:text-primary mb-3 text-3xl font-bold text-balance transition-colors">
                  {title}
                </h3>
                {historyData ? (
                  <>
                    <SemanticDate withIcon date={historyData.creationTime} />
                  </>
                ) : (
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              <div className="border-border/50 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  {historyData && (
                    <div className="flex flex-row gap-2">
                      <ActivityStatusAvatar
                        userToShow={historyData.opponentUser}
                      />
                      <div className="flex flex-col">
                        <p>Przeciwnik</p>
                        <p className="text-muted-foreground text-sm">
                          {historyData.opponentUser.username}
                        </p>
                      </div>
                    </div>
                  )}
                  {!historyData &&
                    badges?.map((badge) => {
                      return (
                        <div
                          className="flex items-center gap-1"
                          key={crypto.randomUUID()}
                        >
                          <span className="text-muted-foreground text-sm font-medium">
                            {badge.badgeIcon}
                          </span>
                          <div className="rounded-lg p-2">
                            {badge.badgeText}
                          </div>
                        </div>
                      )
                    })}
                </div>

                <motion.div className="text-primary flex items-center gap-2 font-semibold">
                  <p> {historyData ? "Szczególy" : primaryActionText}</p>
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ delay: 0.2 }}
              className="text-foreground pointer-events-none absolute top-1/4 right-8 -translate-y-1/2 text-[120px] font-black select-none"
            >
              {bigBgText}
            </motion.div>
          </Card>
        </motion.div>
      </Link>
    </>
  )
}

export function OnlineModeCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="from-card via-card to-muted border-border relative flex h-64 w-full flex-col overflow-hidden rounded-xl border bg-gradient-to-br p-8"
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      </div>

      {/* Content skeleton */}
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {/* Icon skeleton */}
            <div className="bg-muted-foreground/20 h-10 w-10 rounded-xl p-2" />
            {/* Type badge skeleton */}
            <div className="bg-muted-foreground/20 h-6 w-16 rounded-full" />
          </div>
          {/* Timestamp skeleton */}
          <div className="bg-muted-foreground/20 h-6 w-24 rounded-full" />
        </div>

        {/* Title skeleton */}
        <div className="mb-4 flex-1">
          <div className="bg-muted-foreground/20 mb-2 h-6 w-3/4 rounded" />
          <div className="bg-muted-foreground/20 mb-1 h-4 w-full rounded" />
          <div className="bg-muted-foreground/20 h-4 w-5/6 rounded" />
        </div>

        {/* Footer skeleton */}
        <div className="border-border/50 flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2">
            <div className="bg-muted-foreground/20 h-7 w-7 rounded-full" />
            <div className="flex flex-col gap-1">
              <div className="bg-muted-foreground/20 h-3 w-20 rounded" />
              <div className="bg-muted-foreground/20 h-3 w-24 rounded" />
            </div>
          </div>
          <div className="bg-muted-foreground/20 h-4 w-12 rounded" />
        </div>
      </div>
    </motion.div>
  )
}
