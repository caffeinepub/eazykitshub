/**
 * Convert priceCents bigint to display string like "$49.99"
 */
export function formatPrice(priceCents: bigint): string {
  const cents = Number(priceCents);
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  return `$${dollars}.${remainder.toString().padStart(2, "0")}`;
}

/**
 * Format a date from a bigint nanosecond timestamp
 */
export function formatDate(timestampNs: bigint): string {
  const ms = Number(timestampNs / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Status badge color mapping
 */
export function getStatusColor(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "pending":
      return "outline";
    case "confirmed":
      return "secondary";
    case "shipped":
      return "default";
    case "delivered":
      return "default";
    default:
      return "outline";
  }
}
