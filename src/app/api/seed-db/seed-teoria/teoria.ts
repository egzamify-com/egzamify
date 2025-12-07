const secret = ""

// PROD
// const contentFileId = "kg298sqc2tb5b1qgakwkhekxqh7wv4eb"
// const ratingFileId = "kg2dxhyxespgf1g6g1cjd4qaj17wvfx4"
// const qualificationId = "kd724prs7yx7pp9rh70zp46yzx7wvmhe"
// const year = "2024"
// const month = "Czerwiec"
//
//
//
// dev
const contentFileId = "kg239pa970k0r4fxgxmhwdtsmn7wvkc0"
const ratingFileId = "kg2av3d3psn6528qtngwwmev4d7wt3p6"
const qualificationId = "kn7937kjdtnwvce6rzack6q8h17tajt6"
const year = "2024"
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
