// src/app/components/SectionTitle.tsx
import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string; // Allow optional custom classes
}

export default function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h2 className={`text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-300 pb-1 ${className || ''}`}>
      {children}
    </h2>
  );
}