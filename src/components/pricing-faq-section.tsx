"use client"

import { Gift, Lock, Shield, Sparkles } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { Card } from "~/components/ui/card"

const trustBadges = [
  {
    icon: Shield,
    title: "Płatności bezpieczne",
    description: "Szyfrowane połączenie SSL",
  },
  {
    icon: Lock,
    title: "Dane chronione",
    description: "RODO i pełna ochrona danych",
  },
  {
    icon: Gift,
    title: "Darmowa teoria",
    description: "Pełny dostęp bez opłat",
  },
  {
    icon: Sparkles,
    title: "AI tylko za kredyty",
    description: "Płacisz tylko za AI features",
  },
]

const faqItems = [
  {
    question: "Czy teoria jest naprawdę za darmo?",
    answer:
      "Tak! Cała teoria i podstawowe materiały są w pełni darmowe. Płacisz tylko za zaawansowane funkcje AI, które pomagają w nauce.",
  },
  {
    question: "Czy moje dane są bezpieczne?",
    answer:
      "Absolutnie. Stosujemy najwyższe standardy bezpieczeństwa, w tym szyfrowanie SSL i pełną zgodność z RODO. Twoje dane są chronione na każdym etapie.",
  },
  {
    question: "Jak działają płatności?",
    answer:
      "Używamy Stripe - jednego z najbezpieczniejszych systemów płatności na świecie. Wszystkie transakcje są szyfrowane i bezpieczne.",
  },
  {
    question: "Za co dokładnie płacę?",
    answer:
      "Płacisz wyłącznie za kredyty AI, które możesz wykorzystać do zaawansowanych funkcji sztucznej inteligencji wspomagających naukę. Podstawowa teoria i materiały są zawsze darmowe.",
  },
  {
    question: "Czy mogę anulować w każdej chwili?",
    answer:
      "To nie jest subskrypcja! Kupujesz kredyty jednorazowo i używasz ich kiedy chcesz. Nie ma żadnych ukrytych opłat ani automatycznych odnowień.",
  },
]

interface PricingFaqSectionProps {
  showTrustBadges?: boolean
  showFaq?: boolean
  className?: string
}

export default function PricingFaqSection({
  showTrustBadges = true,
  showFaq = true,
  className = "",
}: PricingFaqSectionProps) {
  return (
    <div className={`mx-auto w-full max-w-6xl space-y-16 ${className}`}>
      {/* Trust Badges */}
      {showTrustBadges && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <Card
                key={index}
                className="border-border hover:border-muted-foreground flex flex-col items-center gap-3 p-6 text-center transition-all hover:shadow-md"
              >
                <div className="bg-primary/10 text-primary rounded-full p-3">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{badge.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {badge.description}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* FAQ Section */}
      {showFaq && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-balance md:text-4xl">
              Najczęściej zadawane pytania
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Znajdź odpowiedzi na najpopularniejsze pytania
            </p>
          </div>

          <Card className="border-border p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      )}
    </div>
  )
}
