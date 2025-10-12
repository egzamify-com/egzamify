import { SquareCheck } from "lucide-react"
import { Suspense } from "react"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import AllQualificationsList from "~/components/teoria/all-qualification-list"

import { Card, CardContent } from "~/components/ui/card"

export default function TeoriaPage() {
  return (
    <PageHeaderWrapper
      title="Egzamin Teoretyczny"
      description="Wybierz kwalifikację i rozpocznij naukę. Dostępne są różne tryby nauki
          i testowania wiedzy."
      icon={<SquareCheck size={pageHeaderWrapperIconSize} />}
    >
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingGrid />}>
          <AllQualificationsList />
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
