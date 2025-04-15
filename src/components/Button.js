import React from 'react';
import '../css/Components.css';

export default function Button({ onClick, children, className = '', disabled, type = 1 }) {
    const baseClass = "flex shadow-md h-10 rounded-xl p-6 transition-all duration-300 ease-in-out w-full text-center justify-center items-center gap-2";

    let typeClasses = "";

    switch (type) {
        case 2:
            typeClasses = "bg-secondary text-black hover:bg-yellow-500 hover:text-white";
            break;
        case 3:
            typeClasses = "bg-red-600 text-white hover:bg-red-800"; // exemplo de botão vermelho
            break;
        case 4:
            typeClasses = "bg-green-600 text-white hover:bg-green-800"; // exemplo de botão verde
            break;
        default:
            typeClasses = "bg-primary text-white hover:bg-black";
            break;
    }

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${baseClass} ${typeClasses} ${className}`}
        >
            {children}
        </button>
    );
}
