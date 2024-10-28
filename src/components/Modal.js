import React from 'react';

export default function Modal({ isOpen, onConfirm, onCancel, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div style={styles.background}>
            <div style={styles.modalStyle}>
                {children}
                <div style={styles.modalButtons}>
                    <button style={styles.modalButton} onClick={onConfirm}>Confirmar</button>
                    <button style={styles.modalButton} onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    background: {
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Corrigido para rgba
        zIndex: 1000,
    },
    modalStyle: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1001, // Aumentar para garantir que o modal esteja acima do fundo
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    modalButton: {
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
    },
};
