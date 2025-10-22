"use client"

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { Skeleton } from "../ui/skeleton"
import DashboardBtn from "./dashboard-btn"
import GetCreditsBtn from "./get-credits-btn"
import LogInBtn from "./log-in-btn"
import PrivacyBtn from "./privacy-url"

export function Footer() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-foreground mb-4 font-sans text-4xl font-bold tracking-tight text-balance md:text-3xl">
            Gotowy na rozpoczęcie przygotowań do egzaminu?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-pretty">
            Spraw, aby twoje przygotowania do egzaminów stały się przyjemne i
            skuteczne.
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
            </Unauthenticated>

            <Authenticated>
              <DashboardBtn />
              <GetCreditsBtn />
            </Authenticated>
          </div>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-muted-foreground text-center text-sm">
            © 2025 Egzamify. <PrivacyBtn />
          </p>
        </div>
      </div>
    </footer>
  )
}
