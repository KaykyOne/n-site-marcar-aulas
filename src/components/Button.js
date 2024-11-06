import React from 'react';

export default function Button({ onClick, styleAct, cor, back, children }) {
    return (
        <button
            onClick={onClick}
            style={{
                ...styles.button,
                backgroundColor: back || styles.button.backgroundColor,
                color: cor || styles.button.color,
                ...styleAct
            }}
        >
            {children}
        </button>
    );
}

const styles = {
    button: {
        width: '80%',
        backgroundColor: 'blue', // Valor padrão caso `back` não seja passado
        color: 'white', // Valor padrão caso `cor` não seja passado
        borderRadius: '10px',
        padding: '12px',
        cursor: 'pointer',
        marginTop: '15px',
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background 0.3s',
    },
};
