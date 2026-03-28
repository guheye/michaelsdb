/** Promise-based sleep for throttling outbound fetches. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
