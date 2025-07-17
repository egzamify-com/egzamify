export function formatToYYYYMMDD(input: number | Date): string | null {
  let date: Date;

  if (input instanceof Date) {
    // If the input is already a Date object, use it directly
    date = input;
  } else if (typeof input === "number") {
    date = new Date(input > 2_000_000_000 ? input : input * 1000); // Using 2 billion as a rough threshold for milliseconds (approx year 1970 + 63 years)
  } else {
    // If the input is neither a number nor a Date object, it's invalid
    return null;
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  // Use UTC methods to ensure consistency
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // getUTCMonth() is 0-indexed
  const day = date.getUTCDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function convertEpochToYYYYMMDD(
  epochMs: number,
  timezone = "UTC",
): string {
  // Create a Date object from the epoch milliseconds
  const date = new Date(epochMs);

  // Use Intl.DateTimeFormat for robust timezone handling and formatting
  const formatter = new Intl.DateTimeFormat("en-CA", {
    // 'en-CA' often gives YYYY-MM-DD by default, but we'll specify parts
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  });

  // Get the parts of the date and assemble them
  const parts = formatter.formatToParts(date);

  let year = "";
  let month = "";
  let day = "";

  for (const part of parts) {
    if (part.type === "year") {
      year = part.value;
    } else if (part.type === "month") {
      month = part.value;
    } else if (part.type === "day") {
      day = part.value;
    }
  }

  // Ensure all parts are found (should be with 'year', 'month', 'day')
  if (!year || !month || !day) {
    // Fallback to a simpler UTC format if Intl.DateTimeFormat fails for some reason
    // This is a safeguard, as formatToYYYYMMDD already handles UTC conversion well.
    const d = new Date(epochMs);
    const y = d.getUTCFullYear();
    const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
    const dt = d.getUTCDate().toString().padStart(2, "0");
    return `${y}/${m}/${dt}`;
  }

  return `${year}/${month}/${day}`;
}

export function toSemanticTime(yyyymmdd: string): string {
  // Validate input format: YYYY/MM/DD
  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(yyyymmdd)) {
    return "Invalid Date Format";
  }

  const parts = yyyymmdd.split("/");
  const year = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10) - 1; // Month is 0-indexed in Date object
  const day = parseInt(parts[2]!, 10);

  const inputDateUTC = new Date(Date.UTC(year, month, day));
  const now = new Date(); // Get current full date/time in local timezone
  const nowUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  if (inputDateUTC.getTime() > nowUTC.getTime()) {
    return "Future date";
  }

  // Calculate the difference in full days
  const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in one day
  const diffTime = nowUTC.getTime() - inputDateUTC.getTime();
  const diffDays = Math.floor(diffTime / oneDay);

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return `${diffDays} days ago`;
  }
}
