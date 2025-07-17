export function formatToYYYYMMDD(input: number | Date): string | null {
  let date: Date;

  if (input instanceof Date) {
    // If the input is already a Date object, use it directly
    date = input;
  } else if (typeof input === "number") {
    // If the input is a number, assume it's a timestamp
    // Determine if the timestamp is in seconds or milliseconds
    // Assuming if the timestamp is greater than 2^32, it's likely in milliseconds
    date = new Date(input > 2 ** 32 ? input : input * 1000);
  } else {
    // If the input is neither a number nor a Date object, it's invalid
    return null;
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is 0-indexed
  const day = date.getDate().toString().padStart(2, "0");

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
    throw new Error("Failed to parse date parts for YYYY/MM/DD formatting.");
  }

  return `${year}/${month}/${day}`;
}
export function toSemanticTime(yyyymmdd: string): string {
  // Validate input format: YYYY/MM/DD
  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(yyyymmdd)) {
    return "Invalid Date Format";
  }

  const parts = yyyymmdd.split("/");
  // Use non-null assertion operator '!' because we've already validated the format
  // This tells TypeScript that parts[0], parts[1], parts[2] will definitely be strings
  const year = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10) - 1; // Month is 0-indexed in Date object
  const day = parseInt(parts[2]!, 10);

  // Create a Date object for the input date at the beginning of the day (00:00:00)
  // in the local timezone for comparison with Date.now()
  const inputDate = new Date(year, month, day);

  // Get the current time
  const now = new Date();

  // Calculate the difference in milliseconds from the start of the input day to now
  const diffMs = now.getTime() - inputDate.getTime();

  // To accurately calculate days, we compare dates without their time components.
  const inputDateOnly = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
  );
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDaysMs = nowOnly.getTime() - inputDateOnly.getTime(); // Difference in milliseconds considering only full days

  // Convert milliseconds to various units
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  // For days, we divide the "full day" difference by milliseconds in a day
  const days = Math.floor(diffDaysMs / (1000 * 60 * 60 * 24));

  // Handle future dates
  if (diffMs < 0) {
    return "Future date";
  }

  // Determine the semantic representation
  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (hours < 24) {
    // Still the same calendar day, but more than an hour has passed
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    // One or more full days have passed
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
}
