import Image from "next/image"
import { cn } from "~/lib/utils"

interface FeatureCardProps {
  title: string
  description: string
  imageUrl: string
  reverse?: boolean
}

export function FeatureCard({
  title,
  description,
  imageUrl,
  reverse = false,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-0 overflow-hidden rounded-3xl border px-0 lg:grid-cols-2 lg:gap-0",
      )}
    >
      <div
        className={cn(
          "bg-card relative w-full overflow-hidden",
          "rounded-t-3xl lg:rounded-t-none",
          reverse ? "lg:order-2 lg:rounded-r-3xl" : "lg:rounded-l-3xl",
        )}
      >
        <Image
          width={1200}
          height={1200}
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <div
        className={cn(
          "bg-card text-card-foreground flex h-full flex-col justify-center px-6 py-8",
          "rounded-b-3xl lg:rounded-b-none",
          reverse ? "lg:order-1 lg:rounded-l-3xl" : "lg:rounded-r-3xl",
        )}
      >
        <h2 className="text-foreground mb-3 font-sans text-2xl leading-tight font-bold tracking-tight text-balance sm:mb-4 sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground sm:text-md text-base leading-relaxed text-pretty md:text-lg lg:text-lg xl:text-xl">
          {description}
        </p>
      </div>
    </div>
  )
}
