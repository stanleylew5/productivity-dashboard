import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dash: {
          "orange-100": "#FFE6B9",
          "orange-200": "#D9C1AC",
          "black-100": "#03040A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
