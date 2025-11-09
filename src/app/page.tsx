"use client"
import { FeatureCard } from "~/components/landing-page/feature-showcase"
import { Footer } from "~/components/landing-page/footer"
import { Hero } from "~/components/landing-page/hero"

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />

      <div className="container mx-auto mb-20 flex flex-col gap-20 px-4">
        <FeatureCard
          title="Błyskawicznie sprawdź swój egzamin praktyczny"
          description="Nasza sztuczna inteligencja błyskawicznie przeanalizuje Twoją pracę, wskazując mocne strony i obszary do poprawy. Już nigdy nie trać czasu na samodzielne ocenianie i szukanie błędów w swojej pracy, zostaw to nam!"
          imageUrl="/image.png"
        />

        <FeatureCard
          title="Błyskawicznie sprawdź swój egzamin praktyczny"
          description="Nasza sztuczna inteligencja błyskawicznie przeanalizuje Twoją pracę, wskazując mocne strony i obszary do poprawy. Już nigdy nie trać czasu na samodzielne ocenianie i szukanie błędów w swojej pracy, zostaw to nam!"
          imageUrl="/image.png"
          reverse={true}
        />

        <FeatureCard
          title="Błyskawicznie sprawdź swój egzamin praktyczny"
          description="Nasza sztuczna inteligencja błyskawicznie przeanalizuje Twoją pracę, wskazując mocne strony i obszary do poprawy. Już nigdy nie trać czasu na samodzielne ocenianie i szukanie błędów w swojej pracy, zostaw to nam!"
          imageUrl="/image.png"
        />
      </div>

      <Footer />
    </main>
  )
}
