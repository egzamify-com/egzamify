"use client"

import { Authenticated, Unauthenticated } from "convex/react"
import DashboardBtn from "./dashboard-btn"
import LogInBtn from "./log-in-btn"

export function Hero() {
  return (
    <section className="relative flex flex-1 items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-foreground mb-6 font-sans text-5xl leading-tight font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
          Szybkie i przyjemne przygotowania do egzaminów zawodowych (z AI)
        </h1>

        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-pretty md:text-xl">
          Zapomnij o żmudnym kuciu! Z nami nauka staje się angażującą przygodą,
          a wsparcie AI gwarantuje, że na egzamin pójdziesz z uśmiechem i pełnym
          przygotowaniem.
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
    </section>
  )
}
