// src/app/components/EditorSection.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Icons

interface EditorSectionProps {
  title: string;
  icon: React.ElementType; // Lucide icon component
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function EditorSection({ title, icon: Icon, children, defaultOpen = true }: EditorSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="section-card hover-lift transition-all-fast">
      <button
        className="w-full flex justify-between items-center py-2 text-xl font-outfit font-semibold text-[var(--color-text-dark)] focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Icon className="mr-3 h-6 w-6 text-[var(--color-primary)]" />
          {title}
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}