// src/lib/aiService.ts
// This is your frontend service, which now calls the secure backend API route.

interface AiGenerateContentOptions {
  jobTitle?: string;
  experienceLevel?: string;
  keywords?: string[];
  context?: string;
  sectionType: 'summary' | 'experience' | 'skill' | 'ats_analysis'| 'grammar_check';
  // Add other relevant parameters for tech students
  techSkills?: string[];
  frameworks?: string[];
  resumeText?: string;
}

/**
 * Calls the backend API to generate or analyze resume content using a real AI model.
 */
export async function generateAiContent(options: AiGenerateContentOptions): Promise<string | { score: number; feedback: string; missingKeywords: string[] }> {
  console.log("AI Service: Requesting content for:", options);

  try {
    const response = await fetch('/api/ai-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error calling backend API:', error);
    // Return a structured error response that the UI can handle
    if (options.sectionType === 'ats_analysis') {
        return { score: 0, feedback: 'API call failed.', missingKeywords: [] };
    }
    return "AI could not generate content for this section.";
  }
}