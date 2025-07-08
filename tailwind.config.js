module.exports = {
  content: [
    "./views/**/*.ejs",
    './partials/**/*.ejs',
    "./src/**/*.css"       
  ],
  theme: {
    extend: {
      fontSize: {
        '4.5xl': '2.625rem', // 42px
      },
    },
  },
  plugins: [],

  safelist: [
    'md:top-128'],
}
