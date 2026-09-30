/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F4F7F5",
        surface: "#FFFFFF",
        ink: "#0E211C",
        muted: "#5B6D67",
        line: "#DCE6E1",
        primary: {
          DEFAULT: "#0E5C51",
          dark: "#083F38",
          light: "#DFEEEA",
        },
        amber: {
          DEFAULT: "#D98C2B",
          light: "#FBEDD8",
        },
        crit: {
          DEFAULT: "#C4433B",
          light: "#FBE3E0",
        },
        ok: {
          DEFAULT: "#2F8F5B",
          light: "#E1F2E7",
        },
        info: {
          DEFAULT: "#35688A",
          light: "#E3EDF3",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,33,28,0.06), 0 1px 0 rgba(14,33,28,0.03)",
      },
    },
  },
  plugins: [],
};
