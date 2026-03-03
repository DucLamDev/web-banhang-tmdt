import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fdd835',
          foreground: '#000000',
          50: '#fffde7',
          100: '#fff9c4',
          200: '#fff59d',
          300: '#fff176',
          400: '#ffee58',
          500: '#fdd835',
          600: '#fbc02d',
          700: '#f9a825',
          800: '#f57f17',
          900: '#f57f17',
        },
        secondary: {
          DEFAULT: '#d70018',
          foreground: '#ffffff',
        },
        background: '#f5f5f5',
        foreground: '#333333',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#333333',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#666666',
        },
        accent: {
          DEFAULT: '#2196f3',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#d70018',
          foreground: '#ffffff',
        },
        border: '#e0e0e0',
        input: '#e0e0e0',
        ring: '#fdd835',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
    },
  },
  plugins: [],
};

export default config;
