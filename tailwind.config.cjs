const typography = require("@tailwindcss/typography");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // subtle tweak for better contrast
      },
    },
  },
  plugins: [typography],
};
