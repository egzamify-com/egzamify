const secret = ""
// PROD
// const contentFileId = "kg271g65s39bkq16xf9bjt721h7tzd4g"
// const ratingFileId = "kg2bz9mteap5v8zh00129cdem97tzmt8"

// DEV
const contentFileId = "kg27mdymmc4m83y1x6jeffhzh57wvywh"
const ratingFileId = "kg26pexxgt1jr425ft2e0yh0w97wt1ts"
const qualificationId = "kn70hd791arfasty6tnnz2r2dh7tacbw"
const year = "2025"
const month = "Czerwiec"

async function main() {
  console.log({ secret })
  console.log("started")

  const data = new FormData()
  data.set("contentPdf", contentFileId)
  data.set("ratingPdf", ratingFileId)
  data.set("qualificationId", qualificationId)
  data.set("year", year)
  data.set("month", month)

  const uploadRequest = await fetch(
    "https://egzamify.com/api/seed-db/seed-teoria",
    {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${secret}`,
        // Cookie: `__convexAuthJWT=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJtNTczanFlZjZobTAwZGpxNTR6N2NiYTgyOTd3NXdwc3xqbjc3OWN5eGpybTgxZXd4NWN3MzRobWh3OTd3bnMwOCIsImlhdCI6MTc2NTEyMTY4MiwiaXNzIjoiaHR0cHM6Ly9mb3JtYWwtamF5LTE0Ni5jb252ZXguc2l0ZSIsImF1ZCI6ImNvbnZleCIsImV4cCI6MTc2NTEyNTI4Mn0.mYL-m6320fy5WZDXwauSTPpuCnZ4fTc0z5Bb2_f2KQfse7qsXrfEkY1EvEl2ylp7rVCXgMmNoJs5LrtzAYkd4crvPDxsVq3abWhh2zLs1uOZjUdPbAB_sLtoUfnx1OvpQ1X-jDXdS6Xl2KTce2-PQ27aHYaW3Em1JAHSSSwCMR_7Z1o0-r4igEEBhc6gs8Zc6h2qehJuELQ9VouJIJdPf5sAfSk0aq7fB6Sh7NEOcy2uiAibuZ4oAbYrN70JftE8xEEFxd1bCeANJ76fvncoRkiQ1db7uCr_SXRXVTpfblNb_tjQ7VFp7UymizFbhws1NmwpL6AkruV21uByAsBMMg`,
      },
    },
  )
  console.log({ uploadRequest })
  console.log(await uploadRequest.json())
}
await main()
