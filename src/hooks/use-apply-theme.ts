import { useEffect } from 'react';
import { useSoiStore } from '@/store/soi-store';

export function useApplyTheme(): void {
  const theme = useSoiStore((state) => state.settings.theme);
  const accent = useSoiStore((state) => state.settings.accent);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--accent', accent);
  }, [theme, accent]);
}
