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
    "http://localhost:3000/api/seed-db/seed-teoria",
    {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    },
  )
  console.log({ uploadRequest })
  console.log(await uploadRequest.json())
}
await main()
