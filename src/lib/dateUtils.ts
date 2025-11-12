// Define a consistent type for Epoch values
export type EpochMilliseconds = number
export type EpochSeconds = number // Keep this if you explicitly need seconds sometimes

/**
 * Converts a JavaScript Date object to an Epoch timestamp in milliseconds.
 * This is the standard for JavaScript Date objects.
 */
export function convertDateToEpoch(date: Date): EpochMilliseconds {
  // Directly returns milliseconds, as is standard for date.getTime()
  return date.getTime()
}

/**
 * Converts a date string in "YYYY/MM/DD" or "YYYY-MM-DD" format to an Epoch timestamp in milliseconds.
 */
export function convertYYYYMMDDToEpoch(
  dateString: string,
): EpochMilliseconds | null {
  // Replace slashes with hyphens for robust parsing by Date constructor
  const isoDateString = dateString.replace(/\//g, "-")
  const date = new Date(isoDateString)

  if (isNaN(date.getTime())) {
    console.warn(`Invalid date string provided for conversion: ${dateString}`)
    return null // Return null for invalid input, more robust than NaN
  }

  return date.getTime() // Return milliseconds
}

/**
 * Formats a Date object or Epoch timestamp (milliseconds) to "YYYY-MM-DD" string (UTC).
 * Automatically handles whether input is milliseconds or seconds (with a heuristic).
 */
export function formatToYYYYMMDD(
  input: EpochMilliseconds | Date,
): string | null {
  let date: Date

  if (input instanceof Date) {
    date = input
  } else if (typeof input === "number") {
    // Heuristic: If number is large (likely milliseconds), use as is. Else, assume seconds and convert.
    // 2,000,000,000 seconds is approx year 2033. Safe assumption.
    date = new Date(input > 2_000_000_000_000 ? input : input * 1000) // Adjusted threshold for milliseconds
  } else {
    return null
  }

  if (isNaN(date.getTime())) {
    return null
  }

  const year = date.getUTCFullYear()
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
  const day = date.getUTCDate().toString().padStart(2, "0")

  return `${year}-${month}-${day}`
}

/**
 * Converts an Epoch timestamp (milliseconds) to a "YYYY/MM/DD" string in a specified timezone.
 * Assumes epochMs is in milliseconds.
 */
export function convertEpochToYYYYMMDD(
  epochMs: EpochMilliseconds, // Clearly indicate it expects milliseconds
  timezone = "UTC", // Default to UTC
): string {
  // New Date() constructor expects milliseconds since epoch
  const date = new Date(epochMs)

  if (isNaN(date.getTime())) {
    console.warn(`Invalid epoch milliseconds provided: ${epochMs}`)
    return "Invalid Date" // Handle invalid input
  }

  // Use Intl.DateTimeFormat for robust timezone handling and formatting
  // 'en-CA' is good for YYYY-MM-DD, but specify parts explicitly for YYYY/MM/DD
  const formatter = new Intl.DateTimeFormat("en-US", {
    // "en-US" for / separator
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  })

  // format() returns "MM/DD/YYYY" for "en-US", "YYYY-MM-DD" for "en-CA"
  // For explicit "YYYY/MM/DD", reorder parts or use replace.
  const formattedString = formatter.format(date)
  // Example for "en-US": "07/26/2025" -> "2025/07/26"
  const [monthPart, dayPart, yearPart] = formattedString.split("/")
  return `${yearPart}/${monthPart}/${dayPart}`
}

/**
 * Calculates semantic time difference (e.g., "Today", "Yesterday", "X days ago")
 * based on a YYYY/MM/DD date string.
 * This function's logic is fine as it uses Date objects internally.
 */
export function toSemanticTime(yyyymmdd: string): string {
  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(yyyymmdd)) {
    return "Invalid Date Format"
  }

  const parts = yyyymmdd.split("/")
  const year = parseInt(parts[0]!, 10)
  const month = parseInt(parts[1]!, 10) - 1
  const day = parseInt(parts[2]!, 10)

  // Create UTC date for comparison to avoid timezone issues
  const inputDateUTC = new Date(Date.UTC(year, month, day))

  const now = new Date()
  // Create a UTC date for "today" at midnight UTC
  const nowUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )

  if (isNaN(inputDateUTC.getTime()) || isNaN(nowUTC.getTime())) {
    return "Invalid Date" // Handle cases where input date might be unparseable
  }

  // If the input date is in the future
  if (inputDateUTC.getTime() > nowUTC.getTime()) {
    // If it's today, but the time is in the future relative to now.getUTCDate
    // For "Today", we want strictly less than 1 full day difference.
    // The current date: Fri Jul 26 2024 01:52:48 GMT+0200
    // Example: inputDateUTC = 2025/07/26 (today)
    // nowUTC = 2025/07/26 (today)
    // If inputDateUTC > nowUTC, it implies a date in the future
    return "Future date"
  }

  const oneDay = 1000 * 60 * 60 * 24
  const diffTime = nowUTC.getTime() - inputDateUTC.getTime()
  const diffDays = Math.floor(diffTime / oneDay)

  if (diffDays === 0) {
    return "Dzisiaj"
  } else if (diffDays === 1) {
    return "Wczoraj"
  } else {
    return `${diffDays} dni temu`
  }
}

export function formatDuration(durationMs: number): string {
  // 1. Ensure the duration is a non-negative number of seconds
  const totalSeconds = Math.floor(Math.abs(durationMs) / 1000)

  // 2. Calculate all components

  // Total Hours (no padding for hours, as per requirement for conciseness)
  const hours = Math.floor(totalSeconds / 3600)

  // Remaining Minutes (will be < 60)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  // Remaining Seconds (will be < 60)
  const seconds = totalSeconds % 60

  // 3. Helper function to pad Minutes and Seconds (always needed)
  const pad = (num: number): string => String(num).padStart(2, "0")

  // 4. Return the string based on condition
  if (hours > 0) {
    // Duration is 1 hour or longer: return H:MM:SS (or HH:MM:SS)
    // We do NOT pad the 'hours' component, keeping it concise (e.g., 2:05:30)
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
  } else {
    // Duration is less than 1 hour: return MM:SS
    return `${pad(minutes)}:${pad(seconds)}`
  }
}
