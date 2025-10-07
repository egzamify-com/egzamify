import type { ReactNode } from "react"
import { Skeleton } from "./ui/skeleton"

export const pageHeaderWrapperIconSize = 40

export default function PageHeaderWrapper({
  children,
  icon,
  title,
  description,
  isPending = false,
}: {
  children: ReactNode
  icon?: ReactNode
  title?: string
  description?: string
  isPending?: boolean
}) {
  return (
    <div className="min-h-screen">
      {(title ?? description ?? isPending) && (
        <div className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
              {isPending ? (
                <>
                  <div>
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="mt-2 h-6 w-[400px]" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">{icon}</div>
                  <div>
                    {title && <h1 className="text-3xl font-bold">{title}</h1>}
                    {description && <p className="mt-1">{description}</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
