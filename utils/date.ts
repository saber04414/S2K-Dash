export function formattedTimeFromSeconds(
  input: number | string | Date,
  shortFormat = false
): string {
  // ──► Normalise the input to epoch-seconds
  const seconds =
    typeof input === "number"
      ? input
      : Math.floor(new Date(input).getTime() / 1000);

  if (seconds <= 0) return "just now";

  const nowSeconds = Date.now() / 1000;
  const diff = nowSeconds - seconds;

  const minutes = Math.floor(diff / 60);
  const hours   = Math.floor(diff / 3600);
  const days    = Math.floor(diff / 86400);

  if (shortFormat) {
    if (days  > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  }

  if (days  > 0) return `${days} day${days > 1 ? "s" : ""} ${hours % 24} hour${hours % 24 !== 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes % 60} minute${minutes % 60 !== 1 ? "s" : ""}`;
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
}
