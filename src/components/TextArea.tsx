"use client";

import { useState, useId, useRef, useEffect } from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  autoResize?: boolean;
  className?: string;
}

export default function TextArea({
  label,
  value,
  onChange,
  placeholder = '',
  error,
  disabled = false,
  required = false,
  maxLength,
  rows = 4,
  autoResize = false,
  className = '',
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={rows}
          placeholder={isFloating ? placeholder : ''}
          className={`
            peer w-full min-h-[120px] px-4 pt-7 pb-3
            bg-glass backdrop-blur-sm
            border-2 rounded-lg text-foreground
            transition-all duration-200 ease-out
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${autoResize ? 'resize-none' : 'resize-y'}
            ${error
              ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
              : 'border-glass-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(229,9,20,0.1)]'
            }
            ${disabled ? 'bg-surface/30' : 'hover:border-white/20'}
          `}
          style={{ fontSize: '1rem', lineHeight: '1.5' }}
        />

        <label
          htmlFor={id}
          className={`
            absolute left-4 top-4
            pointer-events-none origin-left
            transition-all duration-200 ease-out
            ${isFloating
              ? 'text-xs -translate-y-2 text-foreground-muted'
              : 'text-base text-foreground-muted'
            }
            ${isFocused && !error ? 'text-primary' : ''}
            ${error ? 'text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      <div className="flex justify-between items-start mt-2 min-h-[20px]">
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {!error && maxLength && (
          <p
            className={`
              text-xs ml-auto tabular-nums
              transition-colors duration-200
              ${value.length > maxLength * 0.9
                ? value.length === maxLength
                  ? 'text-red-500 font-medium'
                  : 'text-yellow-500'
                : 'text-foreground-muted'
              }
            `}
          >
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
