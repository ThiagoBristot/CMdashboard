import React, { useState, useRef, useEffect } from 'react';

function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  idKey, 
  nameKey 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState(
    options.find(opt => opt[idKey] === value)?.[nameKey] || ''
  );
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current !== event.target
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);
    setIsOpen(true);
    setFilteredOptions(
      options.filter(opt => 
        opt[nameKey].toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const handleSelectOption = (option) => {
    setInputValue(option[nameKey]);
    onChange(option[idKey]);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="novavenda-select-cliente"
        placeholder={placeholder}
      />
      {isOpen && (
        <div className="custom-dropdown">
          {filteredOptions.map((option) => (
            <div
              key={option[idKey]}
              className="custom-dropdown-option"
              onClick={() => handleSelectOption(option)}
            >
              {option[nameKey]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;