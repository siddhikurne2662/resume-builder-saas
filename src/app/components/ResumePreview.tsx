// src/app/components/ResumePreview.tsx
import React from 'react';
import { ResumeData, EnhancedResumeData } from '@/types/resume';
import ModernMinimalTemplate from '@/app/builder/ModernMinimalTemplate';

interface ResumePreviewProps {
  resumeData: EnhancedResumeData;
  zoomLevel?: number;
  activeTemplate?: string;
}

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, zoomLevel = 1, activeTemplate = 'modern-minimal' }, ref) => {

    // The previous HTML string generation function has been removed.
    // All template rendering will now be handled by dedicated components.

    const templateContent: React.ReactNode = (() => {
      switch (activeTemplate) {
        case 'modern-minimal':
          return <ModernMinimalTemplate resumeData={resumeData} />;
        // Add other template cases here as you create their components
        // case 'classic-pro':
        //   return <ClassicProTemplate resumeData={resumeData} />;
        default:
          return <ModernMinimalTemplate resumeData={resumeData} />;
      }
    })();

    // The previous template styles object is no longer necessary here since
    // styling is now handled within each template's component file.

    return (
      <div
        ref={ref} // Forward the ref here
        className={`bg-white rounded-lg min-h-[A4] transition-all duration-300 ease-in-out`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          width: '595px', // Standard A4 width in pixels at 96 DPI
          minHeight: '842px', // Standard A4 height in pixels at 96 DPI
        }}
      >
        {templateContent}
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview'; // Important for forwardRef

export default ResumePreview;