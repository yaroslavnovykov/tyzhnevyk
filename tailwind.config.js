/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          light: "var(--primary-light)",
          lighter: "var(--primary-lighter)",
          lightest: "var(--primary-lightest)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#3730A3",
          "primary-content": "#FFFFFF",
          neutral: "#171717",
          "base-100": "rgba(64, 64, 64, 0.1)",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#3730A3",
          "primary-content": "#FFFFFF",
          neutral: "#EEF2FF",
          "base-100": "#171717",
        },
      },
    ],
  },
}