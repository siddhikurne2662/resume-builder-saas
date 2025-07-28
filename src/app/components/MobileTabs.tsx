// src/app/components/MobileTabs.tsx
import React from 'react';

interface MobileTabsProps {
  activeTab: 'edit' | 'preview';
  onTabChange: (tab: 'edit' | 'preview') => void;
}

export default function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden shadow-lg">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => onTabChange('edit')}
          className={`flex-1 flex flex-col items-center justify-center text-sm font-medium py-2 transition-colors ${
            activeTab === 'edit' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mb-1">📝</span> Edit
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={`flex-1 flex flex-col items-center justify-center text-sm font-medium py-2 transition-colors ${
            activeTab === 'preview' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="mb-1">👁️</span> Preview
        </button>
      </div>
    </div>
  );
}