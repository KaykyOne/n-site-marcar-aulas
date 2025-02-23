import React from 'react';
import '../css/Components.css';

export default function InputField({ placeholder, inputMode, value, onChange, type, classNamePersonalized}) {
    return (
        <input
            type={type || 'text'}
            inputMode={inputMode || 'text'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={classNamePersonalized ? classNamePersonalized : 'input'}
        />
    );
}