/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        canvas: '#F8F9FA',
        ink: '#222222',
        gold: {
          DEFAULT: '#C8A96A',
          light: '#DFC697',
          dark: '#A9863F',
        },
        line: '#E8E8E8',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      maxWidth: {
        reading: '800px',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -3%, 0) scale(1.05)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(1.5%, -2%, 0)' },
          '100%': { transform: 'translate3d(0,0,0)' },
        },
        'fade-cross': {
          '0%, 100%': { opacity: '0.035' },
          '50%': { opacity: '0.08' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        aurora: 'aurora 22s ease-in-out infinite',
        'aurora-slow': 'aurora 32s ease-in-out infinite reverse',
        drift: 'drift 40s ease-in-out infinite',
        'fade-cross': 'fade-cross 14s ease-in-out infinite',
        rise: 'rise 0.6s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
