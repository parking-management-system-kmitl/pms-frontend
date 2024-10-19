module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary' : "#007AFF",
        'secondary' : "#D9EBFF",
        'gray-disable' : "#D9D9D9",
        'text-disable' : "#B3B3B3",
        'error' : "#ef4444"
      },
      fontFamily: {
        'ibm': ['"IBM Plex Sans Thai Looped"', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: [],
  },
  plugins: [
    require('daisyui'),
  ],
};
