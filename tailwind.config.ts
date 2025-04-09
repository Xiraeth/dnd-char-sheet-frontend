import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      backgroundImage: {
        bgImage: "url('/bg.png')",
        bgTexture: "url('/bg-texture.jpg')",
      },
      boxShadow: {
        card: "0 1px 3px 1px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        text: {
          light: "hsl(var(--light))",
          dark: "hsl(var(--dark))",
        },
        background: "var(--background)",
      },
      fontFamily: {
        roboto: ["var(--font-roboto)"],
        lato: ["var(--font-lato)"],
        montserrat: ["var(--font-montserrat)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
