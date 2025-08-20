import React, { useState, useEffect } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface ValidatedInputProps {
  type: 'text' | 'email' | 'number';
  value: string | number;
  onChange: (value: any) => void;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  validationRules: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    message: string;
    helpText?: string;
  };
  helpText?: string;
  className?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  type,
  value,
  onChange,
  label,
  placeholder,
  min,
  max,
  validationRules,
  helpText,
  className = ""
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const validateField = (value: any): string | null => {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Neplatný formát emailové adresy';
      }
    }

    if (type === 'number' && value !== '') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return 'Musí být číslo';
      }
      if (validationRules.min !== undefined && numValue < validationRules.min) {
        return `Minimální hodnota je ${validationRules.min}`;
      }
      if (validationRules.max !== undefined && numValue > validationRules.max) {
        return `Maximální hodnota je ${validationRules.max}`;
      }
    }

    if (validationRules.pattern && value && !validationRules.pattern.test(value)) {
      return 'Neplatný formát';
    }

    return null;
  };

  useEffect(() => {
    const validationError = validateField(value);
    setError(validationError);
  }, [value, validationRules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: any = e.target.value;
    
    if (type === 'number') {
      newValue = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
    }
    
    onChange(newValue);
  };

  const getInputClassName = () => {
    let baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors";
    
    if (error) {
      baseClass += " border-red-300 focus:ring-red-500 focus:border-red-300 bg-red-50";
    } else {
      baseClass += " border-gray-300 focus:ring-blue-500 focus:border-blue-300";
    }
    
    return baseClass;
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between min-h-[3rem]">
        <div className="flex items-center">
          {label}
          {helpText && (
            <button
              type="button"
              onMouseEnter={() => setShowHelp(true)}
              onMouseLeave={() => setShowHelp(false)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {error && (
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          className={getInputClassName()}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center animate-fadeIn">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
      
      {showHelp && helpText && (
        <div className="absolute z-10 mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg max-w-xs">
          {helpText}
        </div>
      )}
    </div>
  );
};

export default ValidatedInput;
