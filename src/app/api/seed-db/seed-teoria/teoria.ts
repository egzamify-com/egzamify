const secret = "bxJ3h6xzPY0p2NJ3RQp0zOsr"
// PROD
// const contentFileId = "kg271g65s39bkq16xf9bjt721h7tzd4g"
// const ratingFileId = "kg2bz9mteap5v8zh00129cdem97tzmt8"

// DEV
const contentFileId = "kg2796pzmtfexqpx71sr1d4v6h7wth0h"
const ratingFileId = "kg22k2zqb2yzfdazd47rk664x97wvkq5"
const qualificationId = "kn72g5qad2mxj9ccw87k7fg6yh7wv9kk"
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
