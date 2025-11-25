"use client"

import { SquareCheck } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import AllQualificationsList from "~/components/teoria/all-qualification-list"

import { Loader2, Search } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"

export default function TeoriaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 0) {
      setIsTyping(true)
    } else {
      setIsTyping(false)
    }

    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setIsTyping(false)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  return (
    <PageHeaderWrapper
      title="Egzamin Teoretyczny"
      description="Wybierz kwalifikację i rozpocznij naukę. Dostępne są różne tryby nauki
          i testowania wiedzy."
      icon={<SquareCheck />}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="relative mb-6">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Szukaj kwalifikacji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {isTyping && searchTerm.length > 0 && (
            <Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
          )}
        </div>

        <Suspense fallback={<LoadingGrid />}>
          <AllQualificationsList searchTerm={debouncedSearchTerm} />
        </Suspense>
      </div>
    </PageHeaderWrapper>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden">
          <div className="relative h-40 animate-pulse bg-gray-200" />
          <CardContent className="flex-grow pt-4">
            <div className="mb-2 h-6 animate-pulse rounded bg-gray-200" />
            <div className="mb-4 h-4 animate-pulse rounded bg-gray-200" />
            <div className="flex items-center gap-4">
              <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
              <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
