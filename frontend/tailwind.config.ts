import type { Config } from "tailwindcss";
import Catppuccin from '@catppuccin/tailwindcss'
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [Catppuccin({
    prefix: 'ctp',
    defaultFlavour: 'mocha'
  })],
} satisfies Config;
