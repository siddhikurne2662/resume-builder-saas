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
      colors: {
        // Colors from the new dashboard/settings designs
        'dark-bg-main': '#111a22',
        'dark-bg-medium': '#1a2633', // Used for select backgrounds etc.
        'dark-bg-card': '#243647',
        'dark-border-light': '#334d66',
        'dark-border-medium': '#2b3640',
        'dark-text-light': '#9eadbd',
        'dark-text-blue': '#92adc8', // Used for specific text like "Last edited"
        'light-accent-button': '#b8cfe3', // The light button color
        'blue-call-to-action': '#1572cf', // The prominent blue button
        'blue-button-hover': '#1561ae', // Slightly darker blue for hover
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;