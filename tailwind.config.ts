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
        // Existing colors from the new dashboard/settings designs
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

        // NEW COLORS from the new authentication pages and FloatingLabelInput
        'slate-900': '#0f172a',
        'slate-800': '#1e293b',
        'slate-700': '#334155',
        'slate-600': '#475569',
        'slate-500': '#64748b',
        'slate-400': '#94a3b8',
        'cyan-400': '#22d3ee',
        'cyan-500': '#06b6d4',
        'blue-500': '#3b82f6',
        'blue-600': '#2563eb',
        'blue-700': '#1d4ed8',
        'purple-500': '#a855f7',
        'red-500': '#ef4444',
        'orange-500': '#f97316',
        'yellow-500': '#f59e0b',
        'green-500': '#22c55e',
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