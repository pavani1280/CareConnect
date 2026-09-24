/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f7f3',
          100: '#c2ede3',
          200: '#99dfd0',
          300: '#6eceba',
          400: '#43bba1',
          500: '#00a86b', // Primary vibrant CareConnect green
          600: '#00915c',
          700: '#00754a',
          800: '#0d3834', // Dark Teal Header/Sidebar
          900: '#07221e', // Darkest Teal Background
          dark: '#061a17',
        },
        darkTeal: {
          800: '#0c3530',
          900: '#07231f',
          950: '#041714',
        },
        emeraldGreen: {
          500: '#00a86b',
          600: '#00915c',
        }
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(7, 34, 30, 0.06), 0 2px 6px -1px rgba(7, 34, 30, 0.04)',
        highlight: '0 10px 30px -5px rgba(0, 168, 107, 0.2)',
      },
    },
  },
  plugins: [],
}
