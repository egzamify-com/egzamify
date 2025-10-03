import { FeatureShowcase } from "~/components/landing-page/feature-showcase"
import { Footer } from "~/components/landing-page/footer"
import { Hero } from "~/components/landing-page/hero"

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />

      <div className="mx-auto max-w-7xl">
        <FeatureShowcase
          title="Lightning-fast performance"
          description="Experience unparalleled speed with our optimized infrastructure. Built for scale, designed for developers. Deploy globally in seconds and deliver exceptional user experiences that keep your customers engaged."
          imageUrl=""
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
      </div>
      <Footer />
    </main>
  )
}
