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

  // Capitalize first letter of each word (exclude number inputs)
  const handleChange = (e) => {
    let inputValue = e.target.value;

    // send empty string as is
    if (!inputValue.trim()) {
      onChange({ target: { name, value: '' } });
      return;
    }

    // Skip formatting for number inputs
    if (type === 'number') {
      onChange({ target: { name, value: inputValue } });
      return;
    }

    // Format based on input type and name
    let formattedValue;
    if (type === 'email') {
      formattedValue = inputValue; // keep as-is for email
    } else if (name === 'rrfNumber') {
      formattedValue = inputValue.toUpperCase(); // ALL CAPS for RRF number
    } else {
      formattedValue = inputValue.replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter of each word
    }

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
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${text_ClassName}  ${
          disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300'
            : 'bg-white text-gray-900 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500'
        }`}
        required={required}
        onChange={handleChange}
        value={value}
        disabled={disabled}
      />
      {value && !disabled && type !== 'number' && (
        <span
          className="absolute mt-5 right-3 transform -translate-y-1/2 cursor-pointer z-30 text-gray-500 hover:text-gray-700 bg-white p-1 rounded-sm "
          onClick={handleClear}
          title="Clear"
        >
          <IoCloseCircle size={20} />
        </span>
      )}
    </div>
  );
}
