// src/app/components/RightSidebar.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import AtsChecker from './AtsChecker';
import { EnhancedResumeData } from '@/types/resume';
import { toast } from 'react-hot-toast';
import { generateAiContent } from '@/lib/aiService';

interface RightSidebarProps {
  resumeData: EnhancedResumeData;
  onSelectTemplate: (template: string) => void;
  activeTemplate: string;
}

export default function RightSidebar({ resumeData, onSelectTemplate, activeTemplate }: RightSidebarProps) {
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [grammarSuggestions, setGrammarSuggestions] = useState<string[] | null>(null);

  const handleGrammarCheck = async () => {
    setIsCheckingGrammar(true);
    setGrammarSuggestions(null); // Clear previous results

    try {
      // Stringify the entire resume to send to the AI
      const resumeText = JSON.stringify(resumeData);
      const result = await generateAiContent({
        sectionType: 'grammar_check',
        resumeText: resumeText,
      });

      if (typeof result === 'object' && 'suggestions' in result) {
        setGrammarSuggestions(result.suggestions as string[]);
        toast.success('Grammar check complete!');
      } else {
        toast.error('Failed to get grammar check results from AI.');
      }
    } catch (error) {
      console.error('Error checking grammar:', error);
      toast.error('Failed to perform grammar check.');
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  return (
    <div className="layout-content-container flex flex-col w-[300px] xl:w-[360px] p-6 bg-dark-bg-main rounded-xl shadow-lg border border-dark-border">
      {/* ... (Formatting Section remains the same) ... */}

      <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-4 font-outfit">Formatting</h2>
      <div className="space-y-4 mb-8">
        <label className="flex flex-col flex-1">
          <p className="text-white text-base font-medium leading-normal pb-2 font-inter">Template</p>
          <select
            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-0 border border-dark-border-light bg-dark-bg-card focus:border-dark-border-light h-12 placeholder:text-dark-text-light p-3 text-base font-normal leading-normal"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(146,173,200)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")' }}
            value={activeTemplate}
            onChange={(e) => onSelectTemplate(e.target.value)}
          >
            <option value="modern-minimal">Modern</option>
            <option value="classic-pro">Classic</option>
            <option value="creative-bold">Creative</option>
          </select>
        </label>
        <label className="flex flex-col flex-1">
          <p className="text-white text-base font-medium leading-normal pb-2 font-inter">Font</p>
          <select
            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-0 border border-dark-border-light bg-dark-bg-card focus:border-dark-border-light h-12 placeholder:text-dark-text-light p-3 text-base font-normal leading-normal"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(146,173,200)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")' }}
          >
            <option value="inter">Inter</option>
            <option value="outfit">Outfit</option>
          </select>
        </label>
      </div>

      {/* NEW: ATS Checker Component */}
      <AtsChecker resumeData={resumeData} />

      {/* Check for Errors Section - Simplified, as ATS Checker handles much */}
      <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-4 font-outfit">Other Checks</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-dark-bg-card px-4 min-h-[72px] py-2 justify-between rounded-lg border border-dark-border">
          <div className="flex flex-col justify-center">
            <p className="text-white text-base font-medium leading-normal line-clamp-1 font-inter">Grammar & Spelling</p>
            <p className="text-dark-text-light text-sm font-normal leading-normal line-clamp-2 font-inter">Check for common mistakes in grammar and spelling.</p>
          </div>
          <div className="shrink-0">
            <button
              onClick={handleGrammarCheck}
              disabled={isCheckingGrammar}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-dark-bg-card text-white text-sm font-medium leading-normal w-fit hover:bg-dark-border-light transition-colors font-inter disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingGrammar ? (
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Checking...
                  </div>
                ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Check
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {grammarSuggestions && (
        <div className="bg-dark-bg-card p-4 rounded-lg border border-dark-border-light mt-4">
          <h3 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
            {grammarSuggestions.length > 0 ? <AlertTriangle className="text-orange-500" /> : <CheckCircle className="text-green-500" />}
            {grammarSuggestions.length > 0 ? 'Suggestions Found' : 'No Errors Found!'}
          </h3>
          {grammarSuggestions.length > 0 && (
            <ul className="list-disc list-inside text-dark-text-blue text-sm">
              {grammarSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}