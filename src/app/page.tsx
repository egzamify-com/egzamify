import { FeatureCard } from "~/components/landing-page/feature-showcase"
import { Footer } from "~/components/landing-page/footer"
import { Hero } from "~/components/landing-page/hero"

export default async function Page() {
  return (
    <main className="min-h-screen">
      <Hero />

      <div className="container mx-auto mb-20 flex flex-col gap-20 px-4">
        <FeatureCard
          title="Quiz Duel – Poczuj dreszczyk rywalizacji w trybie 1 na 1"
          description="Tryby online odmienią Twoje przygotowania do egzaminów. Zapomnij o nudnych testach! Przetestuj swoją wiedzę podczas rywalizacji z swoim znajomym."
          imageUrl="/online.jpg"
        />

        <FeatureCard
          title="Błyskawicznie sprawdź swój egzamin praktyczny"
          description="Zleć weryfikację swojej pracy naszej sztucznej inteligencji! Prześlij swoje rozwiązanie egzaminu praktycznego, a AI błyskawicznie przeanalizuje twoją pracę. Otrzymasz szczegółowy raport z oceną punktową, wskazaniem mocnych stron oraz konkretnymi błędami i sugestiami poprawek. Oszczędzaj czas na samodzielnym szukaniu błędów i skup się na doskonaleniu umiejętności."
          imageUrl="/ocena.jpg"
          reverse={true}
        />

        <FeatureCard
          title="Błyskawicznie uzyskaj jasne odpowiedzi"
          description="
Nigdy więcej niejasnych pojęć! Wbudowany czat AI jest dostępny pod ręką.
          Nasza sztuczna inteligencja jest gotowa dostosować odpowiedź do Twoich potrzeb, oferując trzy tryby wyjaśniania: Normalny (zwięzły i rzeczowy), ELI5 (proste, obrazowe analogie) oraz Szczegółowy (dokładny i głęboki). Wiedza w zasięgu ręki, dostosowana do ciebie."
          imageUrl="/czat.jpg"
        />
      </div>

      <Footer />
    </main>
  )
}
