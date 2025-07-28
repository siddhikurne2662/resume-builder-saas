// src/app/components/LoadingSkeleton.tsx
import React from 'react';

interface LoadingSkeletonProps {
  lines?: number;
  height?: string; // Tailwind height class, e.g., 'h-4'
  width?: string; // Tailwind width class, e.g., 'w-full'
}

export default function LoadingSkeleton({ lines = 1, height = 'h-4', width = 'w-full' }: LoadingSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-line ${height} ${width} ${i % 3 === 0 ? 'w-11/12' : i % 3 === 1 ? 'w-full' : 'w-10/12'}`}
        ></div>
      ))}
    </div>
  );
}