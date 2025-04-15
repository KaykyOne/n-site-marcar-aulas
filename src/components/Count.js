import React from 'react';

export default function Count({ num = 0, className = '' }) {
  // Array com 5 posições (índices de 0 a 4)
  const items = Array.from({ length: 5 });

  return (
    <div className={`flex flex-row justify-center gap-2 my-2 ${className}`}>
      {items.map((_, index) => (
        <div
          key={index}
          className={`w-[15px] h-[15px] rounded-full ${
            index < num ? 'bg-neutral-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
