// LoadingIndicator.js
import React from 'react';

const LoadingIndicator = ({ visible }) => {
  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.spinner} />
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
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
  spinner: {
    width: '50px',
    height: '50px',
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #0000ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Adiciona o keyframe da animação no CSS
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default LoadingIndicator;
