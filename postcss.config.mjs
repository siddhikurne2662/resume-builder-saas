// postcss.config.mjs
export default {
  plugins: {
    // Change 'tailwindcss' to '@tailwindcss/postcss'
    '@tailwindcss/postcss': {}, // <<<<< CHANGED THIS LINE
    autoprefixer: {},
  },
};