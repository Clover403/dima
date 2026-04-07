import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#030035',
        bronze: {
          DEFAULT: '#E5997B',
          dark: '#D97E5A',
          light: '#F1C2B0',
        },
        cream: '#FCF6F4',
        lightgray: '#F4F4F5',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter Tight', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
