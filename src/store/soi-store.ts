import { create } from 'zustand';
import { repository } from '@/lib/repository';
import type { Accent, Item, Settings, Theme } from '@/types/domain';

interface SoiState {
  settings: Settings;
  items: Item[];
  kept: number;
  addItem: (name: string, price: number, why: string, at: number, id: string) => void;
  /** Resolve an item: keeping removes it; letting go adds its price to `kept`. */
  decide: (id: string, keep: boolean) => void;
  setHoldHrs: (n: number) => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
}

const initial = repository.getState();

export const useSoiStore = create<SoiState>((set, get) => {
  function patchSettings(patch: Partial<Settings>): void {
    set({ settings: repository.setSettings(patch).settings });
  }
  return {
    settings: initial.settings,
    items: initial.items,
    kept: initial.kept,
    addItem: (name, price, why, at, id) => {
      const items = [{ id, name, price, why, at }, ...get().items];
      set({ items: repository.setItems(items).items });
    },
    decide: (id, keep) => {
      const item = get().items.find((x) => x.id === id);
      const items = get().items.filter((x) => x.id !== id);
      const kept = get().kept + (keep || !item ? 0 : item.price);
      repository.setItems(items);
      set({ items, kept: repository.setKept(kept).kept });
    },
    setHoldHrs: (holdHrs) => patchSettings({ holdHrs }),
    setCurrency: (currency) => patchSettings({ currency }),
    setTheme: (theme) => patchSettings({ theme }),
    setAccent: (accent) => patchSettings({ accent }),
  };
});
