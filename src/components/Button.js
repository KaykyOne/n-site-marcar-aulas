import React from 'react';
import '../css/Components.css';

export default function Button({ onClick, cor, back, border, children }) {
    return (
        <button
            onClick={onClick}
            className="button"
            style={{
                backgroundColor: back || '', 
                color: cor || '',
                border: border,
            }}
        >
            {children}
        </button>
    );
}
