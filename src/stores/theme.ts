import { defineStore } from 'pinia';
import { defaultPrimaryColor, generateThemeVariables } from '@/lib/colors';

interface ThemeState {
  isDark: boolean;
  primaryColor: string;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: false,
    primaryColor: defaultPrimaryColor,
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.updateTheme();
    },

    setPrimaryColor(color: string) {
      this.primaryColor = color;
      this.updateTheme();
    },

    updateTheme() {
      const variables = generateThemeVariables(this.primaryColor);
      const theme = this.isDark ? variables.dark : variables.light;
      
      // Apply CSS variables
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });

      // Update class for dark mode
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    init() {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark = prefersDark;
      this.updateTheme();

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.isDark = e.matches;
        this.updateTheme();
      });
    }
  },

  persist: true
});