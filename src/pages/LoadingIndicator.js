import React from 'react';

const LoadingIndicator = ({ visible }) => {
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
};

// Adicionando estilos de loader
const loaderStyles = `
.loader {
  border: 16px solid #f3f3f3; /* Cor da borda externa */
  border-top: 16px solid #3498db; /* Cor da borda interna */
  border-radius: 50%;
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

export default LoadingIndicator;
