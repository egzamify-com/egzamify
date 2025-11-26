export default function Regulamin() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <h1 className="mb-6 text-3xl font-bold">Regulamin Serwisu Egzamify</h1>

      {/* 1. Postanowienia ogólne */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Postanowienia ogólne</h2>
        <p>
          Niniejszy Regulamin określa zasady korzystania z serwisu internetowego
          Egzamify, dostępnego pod adresem:
          <a
            href="https://egzamify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground ml-1 underline"
          >
            https://egzamify.com
          </a>
          .
        </p>
        <p>
          Właścicielami i administratorami Serwisu są: Dawid Trynkiewicz oraz
          Antoni Ostrowski, prowadzący działalność nierejestrowaną
          (freelancerzy) pod adresem: ul. Dąbrówki 4, 05-300 Mińsk Mazowiecki,
          e-mail:
          <a className="text-muted-foreground ml-1 underline">
            egzamify-admin@proton.me
          </a>
          .
        </p>
        <p>
          Korzystając z Serwisu, Użytkownik akceptuje treść niniejszego
          Regulaminu.
        </p>
        <p>
          Regulamin stanowi umowę pomiędzy Użytkownikiem a Administratorami.
        </p>
      </section>

      {/* 2. Zakres usług */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Zakres usług</h2>
        <ul className="ml-6 list-inside list-disc space-y-2">
          <li>rozwiązywanie testów i quizów,</li>
          <li>system nauki i powtórek,</li>
          <li>chat AI wspomagający naukę,</li>
          <li>zarządzanie kontem i statystykami użytkownika.</li>
        </ul>
        <p>Użytkownicy nie mogą publikować własnych treści w Serwisie.</p>
        <p>
          Korzystanie z części funkcjonalności Serwisu jest darmowe (wersja
          free). Dodatkowe funkcjonalności mogą wymagać zakupu punktów.
        </p>
      </section>

      {/* 3. Rejestracja i konto użytkownika */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          3. Rejestracja i konto użytkownika
        </h2>
        <ul className="ml-6 list-inside list-decimal space-y-2">
          <li>
            Korzystanie z pełnej wersji Serwisu wymaga utworzenia konta
            użytkownika.
          </li>
          <li>
            Rejestracja odbywa się za pośrednictwem usług logowania zewnętrznego
            (OAuth): Google lub GitHub.
          </li>
          <li>Użytkownik zobowiązuje się podawać prawdziwe dane.</li>
          <li>
            Użytkownik ma obowiązek chronić swoje konto przed dostępem osób
            trzecich.
          </li>
        </ul>
      </section>

      {/* 4. Płatności */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Płatności</h2>
        <ul className="ml-6 list-inside list-decimal space-y-2">
          <li>
            Użytkownik może korzystać z płatnych funkcji poprzez zakup punktów.
          </li>
          <li>Zakup punktów ma charakter jednorazowy.</li>
          <li>Płatności obsługuje Stripe Payments Europe Limited.</li>
          <li>Brak automatycznie odnawiających się subskrypcji.</li>
          <li>Cena punktów jest podana w Serwisie.</li>
        </ul>
      </section>

      {/* 5. Licencje i własność intelektualna */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          5. Licencje i własność intelektualna
        </h2>
        <ul className="ml-6 list-inside list-disc space-y-2">
          <li>
            Wszystkie treści dostępne w Serwisie stanowią własność
            Administratorów lub ich partnerów.
          </li>
          <li>
            Użytkownik otrzymuje niewyłączną licencję na korzystanie z Serwisu.
          </li>
          <li>
            Zakazane jest kopiowanie, udostępnianie i rozpowszechnianie treści.
          </li>
          <li>Zabronione jest podejmowanie prób obejścia zabezpieczeń.</li>
        </ul>
      </section>

      {/* 6. Treści użytkowników */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Treści użytkowników</h2>
        <p>Użytkownicy nie publikują własnych treści w Serwisie.</p>
        <p>
          W przypadku przekazania materiałów Administratorowi (np. w kontakcie),
          Użytkownik udziela niewyłącznej licencji na ich przetwarzanie w celu
          obsługi Serwisu.
        </p>
      </section>

      {/* 7. Zabronione działania */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Zabronione działania</h2>
        <ul className="ml-6 list-inside list-disc space-y-1">
          <li>łamanie przepisów prawa,</li>
          <li>wgrywanie treści nielegalnych,</li>
          <li>atakowanie infrastruktury Serwisu,</li>
          <li>reverse engineering,</li>
          <li>zakłócanie działania Serwisu,</li>
          <li>generowanie spamu.</li>
        </ul>
      </section>

      {/* 8. Usunięcie konta */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Usunięcie konta</h2>
        <ul className="ml-6 list-inside list-decimal space-y-2">
          <li>Użytkownik może w każdej chwili usunąć konto.</li>
          <li>
            Usunięcie konta powoduje natychmiastowe usunięcie danych
            użytkownika.
          </li>
          <li>
            Administrator może usunąć konto w przypadku naruszenia Regulaminu.
          </li>
        </ul>
      </section>

      {/* 9. Odpowiedzialność */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">9. Odpowiedzialność</h2>
        <ul className="ml-6 list-inside list-disc space-y-1">
          <li>
            Administratorzy nie gwarantują nieprzerwanej dostępności Serwisu.
          </li>
          <li>Nie odpowiadają za utracone korzyści.</li>
          <li>
            Nie odpowiadają za skutki wykorzystania odpowiedzi AI lub wyników
            testów.
          </li>
        </ul>
      </section>

      {/* 10. Dane osobowe */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">10. Dane osobowe</h2>
        <p>
          Dane osobowe są przetwarzane zgodnie z Polityką Prywatności dostępną w
          Serwisie.
        </p>
      </section>

      {/* 11. Cookies */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">11. Cookies</h2>
        <p>Serwis wykorzystuje pliki cookies zgodnie z Polityką Prywatności.</p>
      </section>

      {/* 12. Zmiany regulaminu */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">12. Zmiany Regulaminu</h2>
        <p>
          Administratorzy mogą zmieniać Regulamin. Aktualna wersja będzie
          dostępna na stronie Serwisu.
        </p>
      </section>

      {/* 13. Prawo właściwe */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">13. Prawo właściwe</h2>
        <p>
          Do Regulaminu stosuje się prawo polskie. Spory rozstrzygane będą przez
          sąd właściwy dla siedziby Administratorów.
        </p>
      </section>

      {/* 14. Kontakt */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">14. Kontakt</h2>
        <p>
          Kontakt w sprawach dotyczących Serwisu:
          <a className="text-muted-foreground ml-1 underline">
            egzamify-admin@proton.me
          </a>
        </p>
      </section>
    </main>
  )
}
