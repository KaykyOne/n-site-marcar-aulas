import React from 'react';

export default function ModalConfirm({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-md w-[90%] max-w-md">
        <p>{message}</p>
        <div className="mt-5 flex justify-between gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Sim
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
}
