/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd5ff',
          300: '#8ebbff',
          400: '#5895fc',
          500: '#3b76f6', 
          600: '#2557eb', // vibrant mobility cobalt
          700: '#1d42d8',
          800: '#1e38af',
          900: '#1e328a',
          950: '#172254',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // electric eco-mobility emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // warm vibrant gold/amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        dark: {
          800: '#172033',
          850: '#0f172a',
          900: '#0a0f1d',
          950: '#060911',
        },
        slate: {
          850: '#151e2e',
          950: '#070b14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'subtle': '0 2px 10px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.03)',
        'card': '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'hover': '0 20px 35px -8px rgba(37, 87, 235, 0.18), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'hover-emerald': '0 20px 35px -8px rgba(16, 185, 129, 0.20), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-dark': '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
        'floating': '0 24px 48px -12px rgba(15, 23, 42, 0.16)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}

