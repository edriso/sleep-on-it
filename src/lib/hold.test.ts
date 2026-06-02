import { describe, expect, it } from 'vitest';
import type { Item } from '@/types/domain';
import { formatLeft, isRipe, msLeft } from './hold';

const item: Item = { id: 'a', name: 'Headphones', price: 80, why: 'shiny', at: 1_000_000 };

describe('hold timer', () => {
  it('is not ripe while the hold period remains', () => {
    const now = item.at + 23 * 3600_000; // 23h into a 24h hold
    expect(isRipe(item, 24, now)).toBe(false);
    expect(msLeft(item, 24, now)).toBe(3600_000);
    expect(formatLeft(item, 24, now)).toBe('1h 0m left');
  });
  it('is ripe once the hold period has elapsed', () => {
    const now = item.at + 24 * 3600_000;
    expect(isRipe(item, 24, now)).toBe(true);
    expect(formatLeft(item, 24, now)).toBeNull();
  });
  it('formats sub-hour time without the hours part', () => {
    const now = item.at + 24 * 3600_000 - 5 * 60000; // 5m left
    expect(formatLeft(item, 24, now)).toBe('5m left');
  });
});
