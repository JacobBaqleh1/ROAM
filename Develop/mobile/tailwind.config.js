/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          yellow: '#EAB308',
          blue: '#2563EB',
        },
      },
    },
  },
  plugins: [],
};
