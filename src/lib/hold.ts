import type { Item } from '@/types/domain';

/*
 * Pure hold-timer maths. An item is "ripe" once its hold period has elapsed; the
 * countdown label is derived from the milliseconds remaining. Kept out of the
 * component so the ripeness boundary is testable with fixed timestamps.
 */
export function msLeft(item: Item, holdHrs: number, now: number): number {
  return item.at + holdHrs * 3600_000 - now;
}

export function isRipe(item: Item, holdHrs: number, now: number): boolean {
  return msLeft(item, holdHrs, now) <= 0;
}

/** A friendly "1h 5m left" / "5m left" label, or null once ripe. */
export function formatLeft(item: Item, holdHrs: number, now: number): string | null {
  const left = msLeft(item, holdHrs, now);
  if (left <= 0) {
    return null;
  }
  const hours = Math.floor(left / 3600_000);
  const mins = Math.floor((left % 3600_000) / 60000);
  return hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;
}
