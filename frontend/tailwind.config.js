/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cazador: {
          brown: "#3B2416",
          amber: "#D99A2B",
          cream: "#FFF7E8",
          green: "#2E7D32",
          orange: "#C75B12",
        },
      },
    },
  },
  plugins: [],
};
