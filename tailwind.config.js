/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: "#2CD377",
        "emerald-dark": "#16A85E",
        forest: "#0F2B1D",
        bg: "#FAFAF7",
        surface: "#FFFFFF",
        sage: "#E3F2E8",
        citrus: "#FF9F1C",
        text: "#16241C",
        "text-muted": "#5C6B62",
      },

      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "24px",
        6: "32px",
        7: "48px",
        8: "64px",
        9: "96px",
      },

      borderRadius: {
        sm: "10px",
        md: "18px",
        lg: "28px",
        full: "999px",
      },

      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },

      fontSize: {
        "display-xl": ["52px", { lineHeight: "60px" }],
        "display-lg": ["34px", { lineHeight: "42px" }],
        h3: ["22px", { lineHeight: "30px" }],
        "body-lg": ["18px", { lineHeight: "28px" }],
        "body-md": ["15px", { lineHeight: "24px" }],
        "body-sm": ["13px", { lineHeight: "20px" }],
      },

      boxShadow: {
        card: "0 1px 3px rgba(15,43,29,.08)",
      },
    },
  },
  plugins: [],
};