import React from 'react';

export default function Select({ value, onChange, options, placeholder, className = "", ...props}) {
  return (
    <select
      id="comboBox"
      value={value}
      onChange={onChange}
      className={`h-[50px] p-3 text-lg w-full bg-white border border-gray-300 rounded-lg shadow-sm shadow-sm${className}`}
      {...props}
    >
      <option key="placeholder" value="" disabled hidden>{placeholder}</option>
      {options
        .filter(option => option.trim() !== "")
        .map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
    </select>
  );
}
