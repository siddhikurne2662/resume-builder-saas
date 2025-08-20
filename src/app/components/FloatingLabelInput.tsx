// src/app/components/FloatingLabelInput.tsx
'use client';

import React, { useState, ChangeEvent } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  isTextArea?: boolean;
  rows?: number;
  cols?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  icon?: LucideIcon;
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
  type = 'text',
  icon: Icon,
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const inputClasses = `
    peer w-full px-3 pt-6 pb-2  /* ADJUSTED: More top padding to prevent overlap */
    bg-slate-800/50 backdrop-blur-sm border-2 rounded-xl
    text-white placeholder-transparent transition-all duration-300 outline-none
    ${isFocused || hasValue ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : 'border-slate-700'}
    hover:border-slate-600 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20
    ${Icon ? 'pl-11' : 'pl-3'}
    ${className || ''}
  `;

  const labelClasses = `
    absolute transition-all duration-300 pointer-events-none z-10 /* ADDED: z-10 to ensure label is on top */
    ${Icon ? 'left-11' : 'left-3'}
    ${isFocused || hasValue
        ? 'top-2 text-xs text-cyan-400 font-medium' /* ADJUSTED: top-2 for better spacing */
        : 'top-1/2 -translate-y-1/2 text-slate-400 text-base'
    }
  `;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e);
  };

  return (
    <div className="relative group">
      <div className="relative">
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
            {...(props as any)}
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
            type={inputType}
            {...(props as any)}
          />
        )}

        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors duration-300 peer-focus:text-cyan-400" />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      </div>
    </div>
  );
}