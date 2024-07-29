/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customColor1:'#F6F1D5',
        customColor2: '#EDD995',
        customColor3: '#F1CF61',
        customColor4: '#FDF4E3',
        customColor5: '#9E6969',
      },
    },
  },
  plugins: [],
}

