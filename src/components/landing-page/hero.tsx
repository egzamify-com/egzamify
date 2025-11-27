"use client"

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { APP_CONFIG } from "~/APP_CONFIG"
import { Skeleton } from "../ui/skeleton"
import DashboardBtn from "./dashboard-btn"
import GetCreditsBtn from "./get-credits-btn"
import LogInBtn from "./log-in-btn"

export function Hero() {
  return (
    <section className="relative flex flex-1 items-center justify-center px-2 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-foreground mb-6 font-sans text-5xl leading-tight font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
          {APP_CONFIG.landingPage.mainTitle}
        </h1>

        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-pretty md:text-xl">
          {APP_CONFIG.landingPage.mainDescription}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <AuthLoading>
            <div className="flex flex-row gap-2">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </AuthLoading>
          <Unauthenticated>
            <LogInBtn />
            <GetCreditsBtn />
          </Unauthenticated>

          <Authenticated>
            <GetCreditsBtn />
            <DashboardBtn />
          </Authenticated>
        </div>
      </div>
    </section>
  )
}
