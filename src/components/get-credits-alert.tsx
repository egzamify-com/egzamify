"use client"

import { Sparkles } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "./ui/button"

export default function GetCreditsAlert({ children }: { children: ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <div className="from-primary/5 to-primary/10 pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br via-transparent" />

        <div className="absolute top-4 right-4 animate-pulse">
          <Sparkles className="text-primary/40 h-6 w-6" />
        </div>

        <AlertDialogHeader className="relative">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-xl" />
              <div className="from-primary to-primary/80 animate-bounce-slow relative rounded-full bg-gradient-to-br p-4">
                <Sparkles className="text-primary-foreground h-8 w-8" />
              </div>
            </div>
          </div>

          <AlertDialogTitle className="text-center text-2xl text-balance">
            Potrzebujesz więcej kredytów!
          </AlertDialogTitle>

          <AlertDialogDescription className="pt-2 text-center text-base leading-relaxed text-pretty">
            Nie martw się! Uzupełnij swoje kredyty i kontynuuj naukę z AI.
            <span className="text-foreground mt-3 block font-semibold">
              Wybierz idealny pakiet dla siebie i ucz się bez ograniczeń!
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="relative mt-2 flex-col gap-2 sm:flex-row">
          <AlertDialogCancel className="sm:flex-1">
            Może później
          </AlertDialogCancel>

          <Link href="/pricing" className="sm:flex-1">
            <AlertDialogAction className="w-full" asChild>
              <Button>Kup kredyty</Button>
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
