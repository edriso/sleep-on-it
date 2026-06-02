import {
  type Item,
  type PersistedState,
  persistedStateSchema,
  type Settings,
} from '@/types/domain';

const STORAGE_KEY = 'soi-v1';

export function createDefaultState(): PersistedState {
  return {
    version: 1,
    settings: { holdHrs: 24, currency: '$', theme: 'calm', accent: '#4f9d8c' },
    items: [],
    kept: 0,
  };
}

export interface Repository {
  getState(): PersistedState;
  saveState(state: PersistedState): void;
  setSettings(patch: Partial<Settings>): PersistedState;
  setItems(items: Item[]): PersistedState;
  setKept(kept: number): PersistedState;
  clear(): void;
}

export function createLocalStorageRepository(storage: Storage = localStorage): Repository {
  function read(): PersistedState {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }
  function saveState(state: PersistedState): void {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }
  function setSettings(patch: Partial<Settings>): PersistedState {
    const current = read();
    const next = { ...current, settings: { ...current.settings, ...patch } };
    saveState(next);
    return next;
  }
  function setItems(items: Item[]): PersistedState {
    const next = { ...read(), items };
    saveState(next);
    return next;
  }
  function setKept(kept: number): PersistedState {
    const next = { ...read(), kept };
    saveState(next);
    return next;
  }
  function clear(): void {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { getState: read, saveState, setSettings, setItems, setKept, clear };
}

export const repository: Repository = createLocalStorageRepository();
