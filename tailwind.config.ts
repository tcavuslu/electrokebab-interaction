import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "off-white": "#F5F0E8",
        "off-black": "#191926",
        yellow: "#F5D547",
        accent: "#F5D547",
        red: "#E63B2E",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      height: {
        hero: "var(--hero-height)",
      },
    },
  },
  plugins: [],
};

export default config;
