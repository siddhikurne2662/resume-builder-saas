// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // REMOVE OR COMMENT OUT THESE CUSTOM COLORS if they were here
      // colors: {
      //   'dark-bg-primary': '#151a1e',
      //   'dark-bg-secondary': '#1f262d',
      //   'dark-border-primary': '#2c363f',
      //   'dark-text-light': '#9fadbc',
      //   'light-accent-button': '#b8cee4',
      // },
      fontFamily: { // Ensure custom fonts are picked up by Tailwind
        inter: ['var(--font-inter)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'), // Keep this if you want container queries to work
  ],
};

export default config;