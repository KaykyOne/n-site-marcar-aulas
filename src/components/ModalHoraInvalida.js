import React from 'react';

const ModalHoraInvalida = ({ visible, setModalVisible }) => {
  if (!visible) return null; // Só renderiza o modal se estiver visível

  return (
    <div style={styles.overlay}>
      <div style={styles.modalView} onClick={(e) => e.stopPropagation()}>
        <img 
          src={require('../imgs/imagemErroTempo.png')} 
          alt="Erro" 
          style={styles.image} 
        />
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  image: {
    maxWidth: '80%',
    maxHeight: '80%',
    margin: '10px',
  },
  button: {
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    color: 'white',
    fontWeight: 'bold',
  },
};

export default ModalHoraInvalida;