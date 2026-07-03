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
        duo: {
          green: "#58CC02",
          "green-dark": "#4CAD00",
          "green-light": "#89E219",
          blue: "#1CB0F6",
          red: "#FF4B4B",
          orange: "#FF9600",
          purple: "#CE82FF",
          gray: {
            100: "#F7F7F7",
            200: "#E5E5E5",
            300: "#AFAFAF",
            400: "#777777",
            500: "#4B4B4B",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
