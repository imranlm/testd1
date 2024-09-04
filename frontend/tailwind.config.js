module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        yellow: '#f48c06',
        bg_gray:'#F7F7F6',
        yellow_light:'#ECB22E',
        footer_blue:'#2D4BB4',
        register_page_bg:'#2C49B0',
        toggle_bg:'#F5F5F5',
        bg_color: '#4673fa',
        sec_color:'#000a29',
        backgroundImage: {
          'custom-gradient': 'linear-gradient(to right, #131F4B 42%, #2C49B1 97%)',
        },
      },
      borderRadius: {
        '4xl': '2rem', 
        '5xl': '2.5rem', 
      },
      fontFamily: {
        Montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
