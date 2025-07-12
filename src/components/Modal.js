import React from 'react';

export default function Modal({ isOpen, onConfirm, onCancel, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center fade-in">
      <div className="flex flex-col bg-white p-5 w-[90%] max-w-[500px] rounded-2xl shadow-lg relative gap-5">
        {children}
      </div>
    </div>
  );
}
