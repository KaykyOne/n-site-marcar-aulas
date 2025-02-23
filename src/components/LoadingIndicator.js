import React from 'react';

export default function LoadingIndicator ({ visible }){
  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div className="loader"></div>
    </div>
  );
};

// Estilos em CSS
const styles = {
  overlay: {
    position: 'fixed', // Usar fixed para sobrepor a página
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    zIndex: 1000,
  },
};

// Adicionando estilos de loader
const loaderStyles = `
.loader {
  border: 5px solid white; /* Cor da borda externa */
  border-top: 5px solid darkgray; /* Cor da borda interna */
  border-radius: 100%;
  width: 60px; /* Tamanho do loader */
  height: 60px; /* Tamanho do loader */
  animation: spin 2s linear infinite; /* Animação */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Injetando estilos na página
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = loaderStyles;
document.head.appendChild(styleSheet);