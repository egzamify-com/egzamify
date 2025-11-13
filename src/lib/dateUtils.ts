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
export function toSemanticTime(timestampMs: number): string {
  // 1. Walidacja wejścia
  if (
    typeof timestampMs !== "number" ||
    isNaN(timestampMs) ||
    timestampMs < 0
  ) {
    return "Nieprawidłowy czas (timestamp)"
  }

  // 2. Ustalenie Czasu
  const inputDate = new Date(timestampMs)
  const now = new Date()

  const inputTimeMs = inputDate.getTime()
  const nowTimeMs = now.getTime()

  // 3. Obsługa dat przyszłych
  if (inputTimeMs > nowTimeMs) {
    return "Data przyszła"
  }

  // 4. Obliczanie różnicy w milisekundach
  const diffTimeMs = nowTimeMs - inputTimeMs

  // --- Progi czasowe (w milisekundach) ---
  const MINUTE = 1000 * 60
  const HOUR = MINUTE * 60
  const DAY = HOUR * 24
  const WEEK = DAY * 7
  const MONTH = DAY * 30.4375 // Średnia
  const YEAR = DAY * 365.25 // Średnia

  // --- Funkcja pomocnicza do polskiej pluralizacji (wymagana!) ---
  // Musisz mieć tę funkcję zdefiniowaną obok toSemanticTimeFromMs
  const pluralizePolish = (
    count: number,
    one: string,
    few: string,
    many: string,
  ): string => {
    if (count === 1) {
      return one
    }
    const lastTwoDigits = count % 100
    const lastDigit = count % 10
    if (lastTwoDigits >= 12 && lastTwoDigits <= 14) {
      return many // 12, 13, 14
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return few // 2, 3, 4, 22, 23, 24, ...
    }
    return many // 0, 5-11, 15-21, 25-31, ...
  }

  // 5. Logika Semantyczna (od najmniejszej jednostki)

  // A. Minuty i Godziny (dla "Dzisiaj")
  if (diffTimeMs < MINUTE) {
    return "przed chwilą"
  } else if (diffTimeMs < HOUR) {
    const minutes = Math.floor(diffTimeMs / MINUTE)
    return `${minutes} ${pluralizePolish(minutes, "minuta", "minuty", "minut")} temu`
  } else if (diffTimeMs < DAY) {
    const hours = Math.floor(diffTimeMs / HOUR)
    return `${hours} ${pluralizePolish(hours, "godzina", "godziny", "godzin")} temu`
  }

  // B. Dni i Większe Jednostki

  // Obliczanie różnicy w DNIach (ignoruje minuty/godziny, aby poprawnie określić "Wczoraj" itd.)
  // Jest to bardziej czytelne niż użycie Math.floor(diffTimeMs / DAY)
  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()
  const inputMidnight = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
  ).getTime()
  const diffDays = Math.floor((nowMidnight - inputMidnight) / DAY)

  // Sprawdzanie 'Dzisiaj' (chociaż już obsłużone przez godziny, to dla pewności)
  if (diffDays === 0) {
    return "Dzisiaj"
  } else if (diffDays === 1) {
    return "Wczoraj"
  } else if (diffTimeMs < WEEK) {
    // diffDays jest 2-6
    return `${diffDays} ${pluralizePolish(diffDays, "dzień", "dni", "dni")} temu`
  } else if (diffTimeMs < MONTH) {
    const weeks = Math.floor(diffTimeMs / WEEK)
    return `${weeks} ${pluralizePolish(weeks, "tydzień", "tygodnie", "tygodni")} temu`
  } else if (diffTimeMs < YEAR) {
    const months = Math.floor(diffTimeMs / MONTH)
    return `${months} ${pluralizePolish(months, "miesiąc", "miesiące", "miesięcy")} temu`
  } else {
    const years = Math.floor(diffTimeMs / YEAR)
    return `${years} ${pluralizePolish(years, "rok", "lata", "lat")} temu`
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
