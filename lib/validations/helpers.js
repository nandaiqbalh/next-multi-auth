/**
 * Converts a ZodError into a flat { field: firstMessage } map.
 * @param {import("zod").ZodError} zodError
 * @returns {Record<string, string>}
 */
export function flattenZodErrors(zodError) {
  return Object.fromEntries(
    Object.entries(zodError.flatten().fieldErrors).map(([key, value]) => [key, value?.[0] ?? ""])
  );
}