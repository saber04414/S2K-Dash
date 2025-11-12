export function formattedTimeFromSeconds(
  input: number,
  shortFormat = false
): string {
  // ──► Input is block count, calculate diff time as 12 * block number
  const diff = input * 12;
  
  if (diff <= 0) return "incredibly ago";

  const months = Math.floor(diff / (30 * 86400));
  const days = Math.floor((diff % (30 * 86400)) / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = Math.floor(diff % 60);

  const parts: string[] = [];
  if (months > 0) parts.push(`${months}mo`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  if (parts.length === 0) return "incredibly ago";
  
  if (shortFormat) {
    return parts.join(' ');
  }

  return parts.join(' ');
}
