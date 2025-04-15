// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // garante que Tailwind escaneie seus arquivos
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6F0A59",        // azul
        secondary: "#ffcc00",      // amarelo
        danger: "#DC2626",
        "custom-gray": "#E5E7EB",  // cinza claro com nome customizado
      },
    },
  },
  plugins: [],
}
