const secret = ""
// PROD
// const contentFileId = "kg271g65s39bkq16xf9bjt721h7tzd4g"
// const ratingFileId = "kg2bz9mteap5v8zh00129cdem97tzmt8"
//
// DEV
const contentFileId = "kg23dkejhpd5tgd2pb1p99hrbn7tzvkp"
const ratingFileId = "kg2avhm7a9mqq4pavrrqmmd6kh7tyhn6"
const qualificationId = "kn70hd791arfasty6tnnz2r2dh7tacbw"

// PROD EE.09
// const qualificationId = "kd72bqykqqyaypdnyzt1p06rm97sd6t4"
const year = "2025"
const month = "Styczeń"

async function main() {
  console.log({ secret })
  console.log("started")

  const data = new FormData()
  data.set("contentPdf", contentFileId)
  data.set("ratingPdf", ratingFileId)
  data.set("qualificationId", qualificationId)
  data.set("year", year)
  data.set("month", month)

  // Use this async function to get the full size
  async function getFormDataPayloadSize(formData: FormData) {
    // Create a dummy Response object from the FormData
    const response = new Response(formData)

    // Read its contents into a Blob (the raw request body)
    const blob = await response.blob()

    // The blob.size property gives the total size in bytes
    return blob.size
  }
  const MAX_MB_LIMIT = 4.5 // Set your maximum size limit here (e.g., 10MB)
  const BYTES_PER_MB = 1024 * 1024
  const MAX_SIZE_BYTES = MAX_MB_LIMIT * BYTES_PER_MB

  // --- Execution and Validation ---
  getFormDataPayloadSize(data)
    .then((sizeInBytes) => {
      // Convert bytes to MB, rounded to two decimal places
      const sizeInMB = (sizeInBytes / BYTES_PER_MB).toFixed(2)

      // Log the human-readable size
      console.log(
        `📦 Total Request Body Size (approx): **${sizeInMB} MB** (${sizeInBytes} bytes)`,
      )

      // --- Validation Check ---
      if (sizeInBytes > MAX_SIZE_BYTES) {
        console.error(
          `🚨 **ERROR:** The request body exceeds the maximum limit of ${MAX_MB_LIMIT} MB!`,
        )
        // Here is where you would **abort** the fetch operation or notify the user.
        // e.g., return; // Stop execution if this is inside an async function
      } else {
        console.log(
          `✅ Size is within the ${MAX_MB_LIMIT} MB limit. Ready to send.`,
        )
        // If valid, proceed with your upload:
        // const uploadRequest = await fetch(...)
      }
    })
    .catch((error) => {
      console.error(
        "❌ Could not calculate payload size. Proceeding with caution or stopping.",
        error,
      )
      // Handle the failure case (e.g., inform the user there was a size calculation issue)
    })

  const uploadRequest = await fetch(
    "http://localhost:3000/api/seed-db/seed-teoria",
    {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${secret}` },
    },
  )
  console.log({ uploadRequest })
  console.log(await uploadRequest.json())
}
await main()
