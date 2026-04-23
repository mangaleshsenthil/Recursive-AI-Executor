/** @type {import('tailwindcss').Config} */
export default {
  // Correctly specifies paths where utility classes are used
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom font definition (if you plan to load Playfair Display via Google Fonts)
      fontFamily: {
        serif: ['Playfair Display', 'serif'], // Overwriting the default serif font
      },
      // You can add custom colors here if needed, but the defaults (amber, gray) are sufficient.
    },
  },
  plugins: [],
}