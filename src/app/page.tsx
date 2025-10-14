import { Footer } from "~/components/landing-page/footer"
import { Hero } from "~/components/landing-page/hero"

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/*<div className="mx-auto max-w-7xl">
        <FeatureShowcase
          title="Błyskawicznie sprawdź swój egzamin praktyczny"
          description="Nasza sztuczna inteligencja błyskawicznie przeanalizuje Twoją pracę, wskazując mocne strony i obszary do poprawy. Już nigdy nie trać czasu na samodzielne ocenianie i szukanie błędów w swojej pracy, zostaw to nam!"
          imageUrl="/ss-praktycznego.webp"
          reverse={false}
        />

        <FeatureShowcase
          title="Seamless collaboration"
          description="Work together effortlessly with real-time updates and integrated workflows. Share feedback, iterate faster, and bring your team's best ideas to life with tools designed for modern development teams."
          imageUrl=""
          reverse={true}
        />

        <FeatureShowcase
          title="Enterprise-grade security"
          description="Rest easy knowing your data is protected by industry-leading security measures. Compliance-ready infrastructure with automatic backups, encryption at rest and in transit, and advanced threat protection."
          imageUrl=""
          reverse={false}
        />
      </div>*/}
      <Footer />
    </main>
  )
}
