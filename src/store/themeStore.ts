import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { themes, ThemeType } from '@lib/themes';

interface ThemeStore {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getThemeColors: () => typeof themes.default;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'default',
      setTheme: (theme) => set({ theme }),
      getThemeColors: () => themes[get().theme],
    }),
    {
      name: 'theme-storage',
    }
  )
);