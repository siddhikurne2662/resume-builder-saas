// src/app/components/FloatingLabelInput.tsx
import React, { useState, ChangeEvent } from 'react';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  isTextArea?: boolean;
  rows?: number;
  cols?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function FloatingLabelInput({
  label,
  id,
  isTextArea = false,
  className,
  value,
  onChange,
  rows,
  cols,
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const inputClasses = `
    form-input
    flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white
    focus:outline-0 focus:ring-0 border border-dark-border-light bg-dark-bg-card focus:border-dark-border-light
    h-14 placeholder:text-dark-text-blue p-4 text-base font-normal leading-normal
    ${className || ''}
  `;

  const labelClasses = `
    absolute
    left-4
    pointer-events-none
    transition-all
    duration-200
    ${(isFocused || hasValue) ? 'top-3 text-xs text-light-button-accent' : 'top-1/2 -translate-y-1/2 text-dark-text-light text-base'}
  `;

  // Explicitly casting props for correct type inference if you choose to use `as any` or separate types.
  // Using specific event handlers for better type safety with onChange.
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e);
  };

  return (
    <div className="relative w-full">
      {isTextArea ? (
        <textarea
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${inputClasses} ${props.height || 'min-h-36'} resize-y`}
          placeholder=" "
          rows={rows}
          cols={cols}
          {...(props as any)} // Cast to any if props spread includes non-textarea attributes
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
          placeholder=" "
          {...(props as any)} // Cast to any if props spread includes non-input attributes
        />
      )}
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
    </div>
  );
}