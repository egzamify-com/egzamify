export default async function PolitykaPrywatnosci() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <h1 className="mb-6 text-3xl font-bold">Polityka Prywatności</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Informacje ogólne</h2>
        <p>
          Niniejsza Polityka prywatności określa zasady przetwarzania danych
          osobowych w ramach serwisu internetowego działającego pod adresem:{" "}
          <a
            href="https://egzamify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground underline"
          >
            https://egzamify.com
          </a>{" "}
          (dalej: „Serwis”).
        </p>
        <p>
          Administratorem danych osobowych jest Dawid Trynkiewicz i Antoni
          Ostrowski, prowadzący działalność pod adresem: ul. Dąbrówki 4, 05-300
          Mińsk Mazowiecki, e-mail:{" "}
          <a className="text-muted-foreground">egzamify-admin@proton.me</a>.
        </p>
        <p>
          Dane osobowe przetwarzane są zgodnie z RODO oraz przepisami krajowymi.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          2. Zakres i cele przetwarzania danych
        </h2>
        <ul className="list-inside list-decimal space-y-2">
          <li>
            Administrator przetwarza dane osobowe użytkowników w celu:
            <ul className="ml-6 list-inside list-disc space-y-1">
              <li>utworzenia i obsługi konta użytkownika,</li>
              <li>
                umożliwienia korzystania z funkcjonalności Serwisu, w tym
                systemu nauki, chatu AI i sieci znajomych,
              </li>
              <li>realizacji zamówień i obsługi płatności za punkty,</li>
              <li>
                kontaktowania się z użytkownikiem poprzez formularze lub e-mail,
              </li>
              <li>
                zapewnienia bezpieczeństwa i prawidłowego działania Serwisu,
              </li>
              <li>
                realizacji obowiązków prawnych ciążących na Administratorze.
              </li>
            </ul>
          </li>
          <li>
            Podstawy prawne przetwarzania danych:
            <ul className="ml-6 list-inside list-disc space-y-1">
              <li>
                art. 6 ust. 1 lit. b) RODO – wykonanie umowy lub działania przed
                jej zawarciem,
              </li>
              <li>
                art. 6 ust. 1 lit. c) RODO – spełnienie obowiązków prawnych,
              </li>
              <li>
                art. 6 ust. 1 lit. f) RODO – prawnie uzasadniony interes
                Administratora.
              </li>
            </ul>
          </li>
          <li>
            Dane przetwarzane: imię, nazwisko, e-mail, identyfikator GitHub,
            zdjęcie profilowe (OAuth), adres IP, dane techniczne.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          3. Logowanie przez zewnętrzne serwisy (OAuth)
        </h2>
        <ul className="list-inside list-decimal space-y-2">
          <li>Serwis umożliwia logowanie przez Google i GitHub.</li>
          <li>
            Administrator otrzymuje dane potrzebne do identyfikacji użytkownika.
          </li>
          <li>Dane używane wyłącznie do logowania.</li>
          <li>Logowanie odbywa się przez bezpieczny protokół OAuth 2.0.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Odbiorcy danych</h2>
        <ul className="list-inside list-decimal space-y-2">
          <li>
            Odbiorcami danych mogą być podmioty współpracujące technicznie,
            m.in.:
            <ul className="ml-6 list-inside list-disc space-y-1">
              <li>Vercel Inc. – hosting,</li>
              <li>Convex – baza danych,</li>
              <li>Stripe Payments Europe Limited – operator płatności,</li>
              <li>upoważnieni współpracownicy Administratora.</li>
            </ul>
          </li>
          <li>
            Dane mogą być przekazywane do państw trzecich (np. USA) zgodnie ze
            standardowymi klauzulami umownymi UE.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          5. Okres przechowywania danych
        </h2>
        <ul className="list-inside list-decimal space-y-2">
          <li>Podczas korzystania z Serwisu (posiadania konta),</li>
          <li>
            do czasu przedawnienia roszczeń wynikających z korzystania z
            Serwisu,
          </li>
          <li>zgodnie z wymogami prawa dla danych księgowych (5 lat),</li>
          <li>lub do czasu cofnięcia zgody (jeżeli dotyczy).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Prawa użytkowników</h2>
        <ul className="ml-6 list-inside list-disc space-y-1">
          <li>dostęp do danych,</li>
          <li>sprostowanie danych,</li>
          <li>usunięcie danych („prawo do bycia zapomnianym”),</li>
          <li>ograniczenie przetwarzania,</li>
          <li>przenoszenie danych,</li>
          <li>wniesienie sprzeciwu wobec przetwarzania,</li>
          <li>wniesienie skargi do Prezesa UODO.</li>
        </ul>
        <p>
          Kontakt:{" "}
          <a className="text-muted-foreground underline">
            egzamify-admin@proton.me
          </a>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Bezpieczeństwo danych</h2>
        <ul className="ml-6 list-inside list-disc space-y-1">
          <li>Środki techniczne i organizacyjne w celu ochrony danych,</li>
          <li>Dostęp wyłącznie dla osób upoważnionych,</li>
          <li>Szyfrowanie połączenia (SSL/TLS) i regularne kopie zapasowe.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Profilowanie</h2>
        <p>
          Dane użytkowników nie są wykorzystywane do podejmowania
          zautomatyzowanych decyzji ani profilowania w rozumieniu art. 22 RODO.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">9. Pliki cookies</h2>
        <ul className="ml-6 list-inside list-disc space-y-1">
          <li>
            Pliki cookies zapewniają prawidłowe działanie strony, utrzymanie
            sesji, zapamiętywanie preferencji i statystyki,
          </li>
          <li>
            Rodzaje plików cookies: sesyjne (usuwane po zamknięciu
            przeglądarki), stałe (przechowywane do momentu usunięcia),
          </li>
          <li>
            Użytkownik może zarządzać plikami cookies w ustawieniach
            przeglądarki.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          10. Zmiany w Polityce prywatności
        </h2>
        <p>
          Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce
          prywatności. Aktualna wersja zawsze dostępna pod:{" "}
          <a className="text-muted-foreground">
            egzamify.com/polityka-prywatnosci
          </a>
          . Zmiany wchodzą w życie z chwilą publikacji.
        </p>
      </section>
    </main>
  )
}
