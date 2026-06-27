import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        'bg-primary': '#e8e0d4',
        'bg-secondary': '#f0e8dc',
        'text-primary': '#3d3428',
        'text-secondary': '#7a6e5d',
        accent: '#d4781c',
        'accent-hover': '#b8651a',
        'accent-light': '#f5dfc5',
        success: '#4a8c5c',
        danger: '#c0392b',
        whatsapp: '#25D366',
        // Dark mode
        'dark-bg-primary': '#2a2520',
        'dark-bg-secondary': '#352f28',
        'dark-text-primary': '#e8e0d4',
        'dark-text-secondary': '#a89882',
        'dark-accent': '#e8943a',
      },
      fontFamily: {
        sans: ['Poppins', 'Noto Sans Bengali', 'sans-serif'],
      },
      borderRadius: {
        neu: '16px',
        'neu-sm': '12px',
        'neu-lg': '24px',
      },
      boxShadow: {
        'neu-light': '6px 6px 12px #c4bdb2, -6px -6px 12px #ffffff',
        'neu-light-sm': '3px 3px 6px #c4bdb2, -3px -3px 6px #ffffff',
        'neu-light-inner': 'inset 4px 4px 8px #c4bdb2, inset -4px -4px 8px #ffffff',
        'neu-dark': '6px 6px 12px #1e1a16, -6px -6px 12px #363024',
        'neu-dark-sm': '3px 3px 6px #1e1a16, -3px -3px 6px #363024',
        'neu-dark-inner': 'inset 4px 4px 8px #1e1a16, inset -4px -4px 8px #363024',
      },
    },
  },
  plugins: [],
};

export default config;
