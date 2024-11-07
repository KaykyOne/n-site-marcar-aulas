import React from 'react';

export default function InputField({ placeholder, inputMode, value, onChange, typ, styleAct }) {
    return (
        <input
            type={typ || 'text'}
            inputMode={inputMode || 'text'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={styleAct ? styleAct : styles.input}
        />
    );
}

const styles = {
    input: {
        width: '80%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra leve
    },
};
