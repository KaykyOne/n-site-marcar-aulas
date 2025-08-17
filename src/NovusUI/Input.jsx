import './public.css';
export default function Input({
    placeholder,
    inputMode = "text",
    value,
    onChange,
    type = "text",
    className = "",
    disabled = false,
    ...props
  }) {
    return (
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          h-[50px]
          w-full
          p-3
          bg-white
          border
          border-gray-300
          rounded-md
          shadow-sm
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-primary
          focus:border-transparent
          transition-all
          duration-200
          ${className}
        `}
        disabled={disabled}
        {...props}
      />
    );
  }
  