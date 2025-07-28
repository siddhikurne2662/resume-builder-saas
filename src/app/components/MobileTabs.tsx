// src/app/components/MobileTabs.tsx
import React from 'react';

interface MobileTabsProps {
  activeTab: 'edit' | 'preview';
  onTabChange: (tab: 'edit' | 'preview') => void;
}

export default function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-bg-medium border-t border-dark-border z-40 md:hidden shadow-lg"> {/* Updated background and border */}
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => onTabChange('edit')}
          className={`flex-1 flex flex-col items-center justify-center text-sm font-medium py-2 transition-colors ${
            activeTab === 'edit' ? 'text-light-button-accent border-b-2 border-light-button-accent' : 'text-dark-text-light hover:text-white' // Updated colors
          }`}
        >
          <span className="mb-1">📝</span> Edit
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={`flex-1 flex flex-col items-center justify-center text-sm font-medium py-2 transition-colors ${
            activeTab === 'preview' ? 'text-light-button-accent border-b-2 border-light-button-accent' : 'text-dark-text-light hover:text-white' // Updated colors
          }`}
        >
          <span className="mb-1">👁️</span> Preview
        </button>
      </div>
    </div>
  );
}