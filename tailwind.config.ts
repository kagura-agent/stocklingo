import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        "pulse-correct": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "streak-pop": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
        "pulse-correct": "pulse-correct 0.4s ease-in-out",
        "slide-up-fade": "slide-up-fade 0.3s ease-out forwards",
        "streak-pop": "streak-pop 0.4s ease-out forwards",
      },
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
