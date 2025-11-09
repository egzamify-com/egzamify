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
        "grid gap-0 lg:grid-cols-2 lg:gap-0",
        "items-center overflow-hidden rounded-3xl px-0",
      )}
    >
      <div
        className={cn(
          "bg-card relative w-full overflow-hidden",
          "aspect-[16/10] sm:aspect-[4/3]",
          "rounded-t-3xl lg:rounded-t-none",
          reverse ? "lg:order-2 lg:rounded-r-3xl" : "lg:rounded-l-3xl",
        )}
      >
        <Image
          width={700}
          height={700}
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <div
        className={cn(
          "bg-card text-card-foreground flex h-full flex-col justify-center",
          "px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12",
          "rounded-b-3xl lg:rounded-b-none",
          reverse ? "lg:order-1 lg:rounded-l-3xl" : "lg:rounded-r-3xl",
        )}
      >
        <h2 className="text-foreground mb-3 font-sans text-2xl leading-tight font-bold tracking-tight text-balance sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed text-pretty sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  )
}
