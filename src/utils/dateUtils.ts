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
