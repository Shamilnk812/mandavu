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
        customColor6: '#4B5563',
        

        customColor7:'#F7F7F7',
        customColor8:'#DEF2F1',
        
      },
      fontFamily: {
        macondo: ['"Macondo Swash Caps"', 'cursive'], // Add the font
      },  
    },
  },
  plugins: [],
}

