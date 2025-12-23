const fs = require("fs")

const CONVEX_URL = "https://confident-aardvark-526.convex.cloud"
const MUTATION_NAME = "teoria/mutate:importQuestionsWithAnswers"

async function runImport() {
  try {
    console.log("1. Wczytuję plik data.json...")

    if (!fs.existsSync("data.json")) {
      throw new Error(
        "Błąd: Nie znaleziono pliku 'data.json'! Upewnij się, że nazwa jest poprawna.",
      )
    }

    const rawData = fs.readFileSync("data.json", "utf8")
    const questionsData = JSON.parse(rawData)

    console.log(`Wczytano ${questionsData.length} pytań. Przygotowuję dane...`)
    // @ts-ignore
    const validatedData = questionsData.map((q) => ({
      ...q,
      year: Number(q.year) || 0,
    }))

    console.log("2. Wysyłam dane do Convexa (fetch mutation)...")

    const response = await fetch(`${CONVEX_URL}/api/mutation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: MUTATION_NAME,
        args: {
          data: validatedData,
        },
        format: "json",
      }),
    })

    const result = await response.json()

    if (result.status === "success") {
      console.log("Wszystkie pytania i odpowiedzi są już w bazie.")
      console.log("Zwrócone dane:", result.value)
    } else {
      console.error("err", JSON.stringify(result, null, 2))
    }
  } catch (error) {}
}

runImport()
