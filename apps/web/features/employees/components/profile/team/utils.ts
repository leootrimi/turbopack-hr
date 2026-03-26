/**
 * Generates up to two initials from a name string.
 * @param name The full name of the person.
 * @returns A string containing the initials (e.g., "JD" for "John Doe").
 */
export function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
