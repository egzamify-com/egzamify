"use client"

import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useQuery } from "convex/react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

interface QualificationData {
  qualification: Doc<"qualifications">
  questionsCount: number
  baseExams: Doc<"basePracticalExams">[]
}

export default function AllQualificationsList({
  searchTerm,
}: {
  searchTerm: string
}) {
  const qualificationsData = useQuery(api.teoria.query.getQualificationsList, {
    search: searchTerm,
  })

  const qualifications: QualificationData[] =
    qualificationsData?.qualifications || []

  if (qualificationsData === undefined) {
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

  if (qualifications.length === 0 && searchTerm) {
    return (
      <Card className="col-span-full">
        <CardContent className="py-12 text-center">
          <h2 className="mb-2 text-xl font-bold">Brak wyników</h2>
          <p className="text-muted-foreground">
            Nie znaleziono kwalifikacji pasujących do "
            <strong>{searchTerm}</strong>".
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Odśwież
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (qualifications.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="py-12 text-center">
          <h2 className="mb-2 text-xl font-bold">
            Brak dostępnych kwalifikacji
          </h2>
          <p className="text-muted-foreground">
            Przepraszamy, ale aktualnie nie ma dostępnych kwalifikacji do nauki.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {qualifications.map((data: QualificationData) => (
        <Card key={data.qualification._id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{data.qualification.name}</CardTitle>
            <p className="text-muted-foreground mt-2 text-sm">
              Pytania: {data.questionsCount}
            </p>
          </CardHeader>
          <CardFooter className="mt-auto flex justify-end">
            <Link
              href={{
                pathname: `/dashboard/egzamin-teoretyczny/${data.qualification.name}/game-modes`,
              }}
            >
              <Button>Rozpocznij naukę</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
