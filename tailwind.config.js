/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "340px",
        xs: "450px",
        sm: "640px",
        md: "760px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
