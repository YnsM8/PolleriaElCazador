/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      colors: {
        cazador: {
          dark: "#0F0B09",
          brown: "#2A1810",
          amber: "#E5A022",
          cream: "#FAF4EC",
          green: "#2E7D32",
          orange: "#E25611",
          gold: "#D4AF37",
          panel: "#15110E",
          border: "#332620"
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
