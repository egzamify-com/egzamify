"use client"

import { motion } from "framer-motion"
import { ArrowRight, Swords, Users } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

interface PvpQuizCardProps {
  title?: string
  description?: string
  qualification?: string
  participantsCount?: number
  firstBadgeText?: string
  firstBadgeIcon?: ReactNode
  secondBadgeText?: string
  secondBadgeIcon?: ReactNode
  bigBgText?: string
  href: string
}

export function PvpQuizCard({
  title = "PvP Quiz Battle",
  description = "Challenge your friends to an epic 1v1 quiz showdown",
  qualification,
  participantsCount,
  firstBadgeText,
  firstBadgeIcon,
  secondBadgeText,
  secondBadgeIcon,
  bigBgText,
  href,
}: PvpQuizCardProps) {
  return (
    <>
      {/* @ts-expect-error fjdks */}
      <Link href={href} className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="from-card via-card to-muted border-border hover:border-primary relative flex min-h-[280px] w-full flex-col overflow-hidden rounded-xl border bg-gradient-to-br p-8 transition-all duration-300"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="bg-primary/10 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl" />
            <div className="bg-accent/10 absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-1 flex-col">
            {/* Header with icon */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="bg-primary/20 border-primary rounded-xl border-2 p-3"
                >
                  <Swords className="text-primary h-8 w-8" />
                </motion.div>
                {qualification && (
                  <span className="bg-accent/20 text-accent border-accent/30 rounded-full border px-3 py-1 text-sm font-medium">
                    {qualification}
                  </span>
                )}
              </div>

              {participantsCount !== undefined && (
                <div className="bg-muted/50 flex items-center gap-2 rounded-full px-3 py-1.5">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground text-sm font-medium">
                    {participantsCount}
                  </span>
                </div>
              )}
            </div>

            {/* Title and description */}
            <div className="mb-6 flex-1">
              <h3 className="text-foreground group-hover:text-primary mb-3 text-3xl font-bold text-balance transition-colors">
                {title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {description}
              </p>
            </div>

            {/* Bottom section with stats and CTA */}
            <div className="border-border/50 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2">{firstBadgeIcon}</div>
                  <span className="text-muted-foreground text-sm font-medium">
                    {firstBadgeText}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2">{secondBadgeIcon}</div>
                  <span className="text-muted-foreground text-sm font-medium">
                    {secondBadgeText}
                  </span>
                </div>
              </div>

              <motion.div
                // whileHover={{ x: 5 }}
                className="text-primary flex items-center gap-2 font-semibold"
              >
                <span>Rozpocznij</span>
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </div>
          </div>

          {/* Decorative VS element */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground pointer-events-none absolute top-1/4 right-8 -translate-y-1/2 text-[120px] font-black select-none"
          >
            {bigBgText}
          </motion.div>
        </motion.div>
      </Link>
    </>
  )
}
