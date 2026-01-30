import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#001F3D',
          peach: '#F7B980',
          coral: '#ED985F',
        },
        primary: {
          DEFAULT: '#001F3D', // brand.navy
        },
        secondary: {
          DEFAULT: '#ED985F', // brand.coral
        },
        accent: {
          DEFAULT: '#F7B980', // brand.peach
        },
      },
    },
  },
  plugins: [],
};

export default config;
