import React from 'react';
import { IoCloseCircle } from 'react-icons/io5';

export default function Input_Text({
  label,
  id,
  name,
  placeholder,
  required,
  onChange,
  value,
  disabled,
  className,
  text_ClassName,
  type = 'text',
}) {
  const handleClear = () => {
    const event = { target: { name, value: '' } };
    onChange(event);
  };

  // Capitalize first letter of each word
  const handleChange = (e) => {
    let inputValue = e.target.value;

    // send empty string as is
    if (!inputValue.trim()) {
      onChange({ target: { name, value: '' } });
      return;
    }

    // capitalize only if there is content
    let formattedValue =
      type === 'email'
        ? inputValue // keep as-is for email
        : inputValue.replace(/\b\w/g, (char) => char.toUpperCase());

    onChange({ target: { name, value: formattedValue } });
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`block text-gray-600  mb-1 font-semibold ${className}`}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-gray-500 px-4 py-3 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 transition ${text_ClassName}  ${
          disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-500'
            : 'bg-white text-gray-900 border-gray-500 focus:border-green-700 focus:ring-2 focus:ring-green-700'
        }`}
        required={required}
        onChange={handleChange}
        value={value}
        disabled={disabled}
      />
      {value && !disabled && (
        <span
          className="absolute mt-6 right-3 transform -translate-y-1/2 cursor-pointer z-30 text-gray-500 hover:text-gray-700 bg-white p-1 rounded-sm "
          onClick={handleClear}
          title="Clear"
        >
          <IoCloseCircle size={20} />
        </span>
      )}
    </div>
  );
}
