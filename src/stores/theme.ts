import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false
  }),
  
  actions: {
    init() {
      // Check if user has a theme preference
      const isDark = localStorage.getItem('theme') === 'dark';
      
      // Check system preference if no stored preference
      if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDark = prefersDark;
        this.updateTheme();
        return;
      }
      
      this.isDark = isDark;
      this.updateTheme();
    },
    
    toggle() {
      this.isDark = !this.isDark;
      this.updateTheme();
    },
    
    updateTheme() {
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', this.isDark);
    }
  }
});