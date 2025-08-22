// src/app/components/AtsChecker.tsx
'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import FloatingLabelInput from './FloatingLabelInput'; // Assuming correct path
import { generateAiContent } from '@/lib/aiService'; // Import the AI service
import { toast } from 'react-hot-toast';
import { ResumeData } from '@/types/resume'; // Import ResumeData type

interface AtsCheckerProps {
  resumeData: ResumeData;
}

export default function AtsChecker({ resumeData }: AtsCheckerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeAts = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description to analyze.');
      return;
    }
    setIsLoading(true);
    try {
      // Prepare resume content for AI analysis
      const resumeText = JSON.stringify(resumeData); // A simple way to send, for real AI, you'd send structured data or a plain text version

      const result = await generateAiContent({
        sectionType: 'ats_analysis',
        context: resumeText,
        jobTitle: "Tech Student Role", // Placeholder
        experienceLevel: "Entry-level/Intern", // Placeholder
        // In a real scenario, you'd parse job description for keywords
        keywords: jobDescription.split(/\s+/).filter(word => word.length > 2 && word.match(/^[a-zA-Z0-9]+$/)),
      });

      if (typeof result === 'object' && result !== null && 'score' in result && 'feedback' in result) {
        const atsResult = result as { score: number; feedback: string; missingKeywords: string[] };
        setAtsScore(atsResult.score);
        setFeedback(atsResult.feedback);
        setMissingKeywords(atsResult.missingKeywords);
        toast.success('ATS analysis complete!');
      } else {
        toast.error('Failed to get ATS analysis from AI.');
      }

    } catch (error: unknown) {
      console.error('Error analyzing ATS:', error);
      let errorMessage = "ATS analysis failed.";
      if (error instanceof Error) {
        errorMessage = `ATS analysis failed: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-4 font-outfit">ATS Optimization</h2>
      <p className="text-dark-text-light text-sm font-normal leading-normal font-inter">
        Paste a job description to get an ATS compatibility score and suggestions.
      </p>
      <FloatingLabelInput
        id="job-description"
        label="Paste Job Description Here"
        isTextArea
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        onClick={handleAnalyzeAts}
        disabled={isLoading || !jobDescription.trim()}
        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-blue-call-to-action text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-button-hover transition-colors font-inter disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Analyzing...
          </div>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" /> Analyze with AI
          </>
        )}
      </button>

      {atsScore !== null && (
        <div className="bg-dark-bg-card p-4 rounded-lg border border-dark-border-light mt-4">
          <h3 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
            {atsScore >= 80 ? <CheckCircle className="text-green-500" /> : <AlertTriangle className="text-orange-500" />}
            ATS Score: <span className={atsScore >= 80 ? 'text-green-500' : 'text-orange-500'}>{atsScore}%</span>
          </h3>
          <p className="text-dark-text-light text-sm mb-2">{feedback}</p>
          {missingKeywords.length > 0 && (
            <div className="mt-3">
              <p className="text-white text-sm font-medium">Suggested Keywords to Add:</p>
              <ul className="list-disc list-inside text-dark-text-blue text-sm">
                {missingKeywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}