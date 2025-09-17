"use client"

import Link from "next/link"
import { Button } from "~/components/ui/button"

export default function LandingPage() {
  return (
    <main className="">
      Landing page{" "}
      <Button>
        <Link href={"/pricing"}>pricing</Link>
      </Button>
    </main>
  )
}
