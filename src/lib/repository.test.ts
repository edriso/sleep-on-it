import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => {
      map.delete(k);
    },
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  } as Storage;
}

describe('repository', () => {
  let repo: Repository;
  let storage: Storage;
  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });

  it('returns defaults when empty', () => {
    expect(repo.getState().settings.holdHrs).toBe(24);
    expect(repo.getState().items).toEqual([]);
    expect(repo.getState().kept).toBe(0);
  });
  it('falls back to defaults on corrupt data', () => {
    storage.setItem('soi-v1', 'nope');
    expect(repo.getState().settings.currency).toBe('$');
  });
  it('round-trips items, kept, and settings', () => {
    repo.setItems([{ id: 'a', name: 'Lamp', price: 40, why: '', at: 1 }]);
    repo.setKept(40);
    repo.setSettings({ holdHrs: 48 });
    const after = repo.getState();
    expect(after.items).toHaveLength(1);
    expect(after.kept).toBe(40);
    expect(after.settings.holdHrs).toBe(48);
  });
});
