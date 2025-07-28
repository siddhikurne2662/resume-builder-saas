// src/app/components/FloatingLabelInput.tsx
import React, { useState, ChangeEvent } from 'react';

// The key fix is to redefine onChange to explicitly handle both types.
// We also extend from InputHTMLAttributes<HTMLInputElement> for common input props,
// and manually add textarea-specific props like rows/cols.
interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  isTextArea?: boolean;
  rows?: number;
  cols?: number;
  // This is the updated onChange type to be more inclusive
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
  const hasValue = value && String(value).length > 0;

  const inputClasses = `
    form-input
    flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white
    focus:outline-0 focus:ring-0 border-none bg-dark-bg-card focus:border-none
    h-14 placeholder:text-dark-text-blue p-4 text-base font-normal leading-normal
    ${className || ''}
  `;

  const labelClasses = `
    absolute
    left-4
    top-1/2
    -translate-y-1/2
    text-dark-text-light
    peer-focus:top-3
    peer-focus:text-xs
    peer-focus:text-light-button-accent
    peer-placeholder-shown:top-1/2
    peer-placeholder-shown:text-base
    peer-placeholder-shown:text-dark-text-light
    transition-all
    duration-200
    pointer-events-none
    ${(isFocused || hasValue) ? 'top-3 text-xs text-light-button-accent' : ''}
  `;

  return (
    <div className="relative w-full">
      {isTextArea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange as any} // Still need 'as any' here if props are spread, or separate handlers for strictness
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${inputClasses} ${props.height || 'min-h-36'} resize-y`}
          placeholder=" "
          rows={rows}
          cols={cols}
          {...props as any}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange as any} // Still need 'as any'
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
          placeholder=" "
          {...props as any}
        />
      )}
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
    </div>
  );
}