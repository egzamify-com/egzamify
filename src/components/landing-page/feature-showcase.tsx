import { cn } from "~/lib/utils"

interface FeatureShowcaseProps {
  title: string
  description: string
  imageUrl: string
  reverse?: boolean
}

export function FeatureShowcase({
  title,
  description,
  imageUrl,
  reverse = false,
}: FeatureShowcaseProps) {
  return (
    <div
      className={cn(
        "grid gap-8 lg:grid-cols-2 lg:gap-16",
        "items-center px-6 py-16 md:py-24",
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "bg-card relative aspect-[4/3] w-full overflow-hidden rounded-2xl",
          reverse && "lg:order-2",
        )}
      >
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div
        className={cn("flex flex-col justify-center", reverse && "lg:order-1")}
      >
        <h2 className="text-foreground mb-4 font-sans text-3xl leading-tight font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
          {description}
        </p>
      </div>
    </div>
  )
}
