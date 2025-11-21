"use client";

import { useState, useId } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  className = '',
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Select */}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className={`
            peer w-full px-4 py-4 pt-6 bg-surface/50 backdrop-blur-sm
            border-2 rounded-xl text-foreground
            transition-all duration-200 ease-out
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
              : 'border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/20'
            }
            ${disabled ? 'bg-surface/30' : 'hover:border-white/20'}
            ${!hasValue ? 'text-muted' : ''}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface text-foreground">
              {option.label}
            </option>
          ))}
        </select>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`
            absolute left-4 pointer-events-none
            transition-all duration-200 ease-out
            ${isFloating 
              ? 'top-2 text-xs font-medium' 
              : 'top-1/2 -translate-y-1/2 text-base'
            }
            ${error 
              ? 'text-red-500' 
              : isFocused 
                ? 'text-primary' 
                : 'text-muted'
            }
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Dropdown Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
