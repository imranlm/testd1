import React, { useState } from "react";

const InputField = ({ label, type, id, name, placeholder, autoComplete, value, error, onChange,focusColor,top }) => {
    const [isFocused, setIsFocused] = useState(false);
  
    const handleInputFocus = () => {
      setIsFocused(true);
    };
  
    const handleInputBlur = () => {
      setIsFocused(false);
    };
  
    return (
      <div className="mb-4 relative">
        <label
          htmlFor={id}
          className={`absolute transition-all duration-300 ${
            (isFocused || value) ? `text-sm  text-${focusColor} -top-6 left-1` : "top-2 left-3 md:left-3 sm:left-2 sm:text-xs md:text-sm lg:text-sm text-gray-500"
          }`}
        >
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={name}
          className={`p-2 border rounded w-full outline-none ${
            isFocused ? "text-black" : "text-gray-800"
          } bg-gray-100`}
          placeholder={!isFocused ? placeholder : ''}
          autoComplete={autoComplete}
          onChange={onChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          value={value}
        />
        {error && (
          <p className="text-red-800 font-bold text-xs mt-1">{error}</p>
        )}
      </div>
    );
  };
  
  export default InputField;
  