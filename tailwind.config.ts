import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#030035',
        bronze: '#E5997B',
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
