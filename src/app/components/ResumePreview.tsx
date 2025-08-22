// src/app/components/ResumePreview.tsx
import React, { lazy, Suspense } from 'react';
import { EnhancedResumeData } from '@/types/resume';

// Dynamically import all template components using absolute paths
const templateComponents: { [key: string]: React.ElementType } = {
  'software-engineering-lead': lazy(() => import('@/app/builder/SoftwareEngineeringLeadTemplate')),
  'e-commerce-cfo': lazy(() => import('@/app/builder/EcommerceCfoTemplate')),
  'classic-template': lazy(() => import('@/app/builder/ClassicTemplate')),
  'big-data-engineer-template': lazy(() => import('@/app/builder/BigDataEngineerTemplate')),
  'data-analyst-template': lazy(() => import('@/app/builder/DataAnalystTemplate')),
  'product-manager-template': lazy(() => import('@/app/builder/ProductManagerTemplate')),
  'classic-pro-template': lazy(() => import('@/app/builder/ClassicProTemplate')),
  'freelancer-template': lazy(() => import('@/app/builder/FreelancerTemplate')),
};

export type PaperSize = 'US_LETTER' | 'A4';

export const PAPER_SIZES: Record<PaperSize, { name: string; widthPx: number; heightPx: number; widthIn: number; heightIn: number }> = {
  US_LETTER: {
    name: 'US Letter',
    widthPx: 612,
    heightPx: 792,
    widthIn: 8.5,
    heightIn: 11
  },
  A4: {
    name: 'A4',
    widthPx: 595,
    heightPx: 842,
    widthIn: 8.27,
    heightIn: 11.69
  }
};

const pdfStyles = `
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .resume-container {
    max-width: none !important;
    margin: 0 !important;
    padding: 0.5in !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    transform: none !important;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  .break-inside-avoid {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
}
`;

interface ResumePreviewProps {
  resumeData: EnhancedResumeData;
  zoomLevel?: number;
  activeTemplate?: string;
  paperSize?: PaperSize;
}

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, activeTemplate = 'software-engineering-lead', paperSize = 'US_LETTER' }, ref) => {
    const TemplateComponent = templateComponents[activeTemplate];

    if (!TemplateComponent) {
      return (
        <div
          ref={ref}
          className="flex justify-center items-center bg-white rounded-lg shadow-lg resume-container"
          style={{
            width: `${PAPER_SIZES[paperSize].widthPx}px`,
            minHeight: `${PAPER_SIZES[paperSize].heightPx}px`,
          }}
        >
          <div className="text-center p-8">
            <p className="text-gray-600 mb-4">Template &quot;{activeTemplate}&quot; not found.</p>
            <p className="text-sm text-gray-400">Please select a different template.</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <style>{pdfStyles}</style>
        <div
          ref={ref}
          className="bg-white rounded-lg shadow-lg overflow-hidden resume-container"
          style={{
            width: `${PAPER_SIZES[paperSize].widthPx}px`,
            minHeight: `${PAPER_SIZES[paperSize].heightPx}px`,
          }}
        >
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-3 text-gray-600">Loading template...</span>
              </div>
            }
          >
            <TemplateComponent resumeData={resumeData} />
          </Suspense>
        </div>
      </>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;