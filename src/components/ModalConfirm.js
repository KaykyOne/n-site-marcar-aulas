import React, { useState } from 'react';

export default function ModalConfirm({ message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p>{message}</p>
        <div style={styles.buttons}>
          <button style={styles.confirmButton} onClick={onConfirm}>Sim</button>
          <button style={styles.cancelButton} onClick={onCancel}>Não</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  buttons: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  confirmButton: {
    padding: '10px 20px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
