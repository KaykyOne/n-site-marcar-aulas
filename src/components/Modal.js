import React from 'react';
import '../css/Modal.css';

export default function Modal({ isOpen, onConfirm, onCancel, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className='overlay'>
            <div className='modalStyle'>
                {children}
            </div>
        </div>
    );
}
