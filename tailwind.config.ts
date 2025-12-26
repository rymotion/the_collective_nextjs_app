import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--secondary-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        foreground: "rgb(var(--foreground-rgb) / <alpha-value>)",
        muted: "rgb(var(--foreground-muted-rgb) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
