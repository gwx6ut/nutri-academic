import { type Config } from 'tailwindcss';

const brandGreen = {
  50: '#f5fff5',
  100: '#dcffdc',
  200: '#b8ffb8',
  300: '#94ff94',
  400: '#70ff70',
  500: '#4cff4c',
  600: '#39cc39',
  700: '#2a992a',
  800: '#1c661c',
  900: '#0f3315',
};

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        green: brandGreen,
        primary: brandGreen[500],
      },
    },
  },
  plugins: [],
};

export default config;
