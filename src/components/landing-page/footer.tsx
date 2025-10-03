"use client"

import { Authenticated, Unauthenticated } from "convex/react"
import DashboardBtn from "./dashboard-btn"
import LogInBtn from "./log-in-btn"

export function Footer() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-foreground mb-4 font-sans text-4xl font-bold tracking-tight text-balance md:text-5xl">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-pretty">
            Join thousands of developers building the next generation of web
            applications. Start your journey today.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Unauthenticated>
              <LogInBtn />
            </Unauthenticated>
            <Authenticated>
              <DashboardBtn />
            </Authenticated>
          </div>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-muted-foreground text-center text-sm">
            © 2025 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
