// src/app/components/FloatingLabelInput.tsx
import React, { useState, ChangeEvent } from 'react'; // Import ChangeEvent if not already there

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // If it's a textarea, it will extend HTMLTextAreaAttributes.
  // For simplicity with shared props, we keep InputHTMLAttributes here,
  // and manually add textarea-specific props.
  label: string;
  id: string;
  isTextArea?: boolean;
  rows?: number; // <<<<< ADDED THIS LINE
  cols?: number; // <<<<< ADDED THIS LINE (for completeness, though often handled by CSS)
  // The value prop is already part of React.InputHTMLAttributes
  // onChange is also part of React.InputHTMLAttributes, but we explicitly type it for clarity
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function FloatingLabelInput({
  label,
  id,
  isTextArea = false,
  className,
  value,
  onChange, // Explicitly destructure onChange
  rows,    // Explicitly destructure rows
  cols,    // Explicitly destructure cols
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && String(value).length > 0;

  const inputClasses = `
    input-field
    w-full
    pt-6 pb-2 px-4
    peer
    ${className || ''}
  `;

  const labelClasses = `
    absolute
    left-4
    top-1/2
    -translate-y-1/2
    text-[var(--color-text-light)]
    peer-focus:top-3
    peer-focus:text-xs
    peer-focus:text-[var(--color-primary)]
    peer-placeholder-shown:top-1/2
    peer-placeholder-shown:text-base
    peer-placeholder-shown:text-[var(--color-text-medium)]
    transition-all
    duration-200
    pointer-events-none
    ${(isFocused || hasValue) ? 'top-3 text-xs text-[var(--color-primary)]' : ''}
  `;

  return (
    <div className="relative w-full">
      {isTextArea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange as any} // Cast onChange to 'any' for textarea, as it's ChangeEvent<HTMLTextAreaElement>
                                  // or create a separate handler if strict typing is preferred.
                                  // For simplicity, 'any' is common for shared onChange prop.
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${inputClasses} h-28 resize-y`}
          placeholder=" "
          rows={rows} // Pass the rows prop
          cols={cols} // Pass the cols prop
          {...props as any} // Cast props to 'any' to allow textarea-specific props
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange as any} // Cast onChange to 'any' for input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
          placeholder=" "
          {...props as any} // Cast props to 'any' for input
        />
      )}
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
    </div>
  );
}