// src/app/api/ai-generate/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Access your API key as a server-side environment variable
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: Request) {
  try {
    const { sectionType, context, jobDescription, resumeText } = await request.json();
    let prompt = '';

    if (sectionType === 'ats_analysis') {
      prompt = `Analyze the following resume content and job description. Provide an ATS compatibility score, feedback, and a list of missing keywords.
      Resume: ${context}
      Job Description: ${jobDescription}

      Response format should be a JSON object with keys: 'score' (number), 'feedback' (string), and 'missingKeywords' (string[]).`;
    } else if (sectionType === 'grammar_check') {
       prompt = `Review the following resume for grammar and spelling errors. Provide a list of suggested changes. The response should be a JSON object with a single key 'suggestions' that is an array of strings. Each string should describe a single suggestion.

       Resume Text: ${resumeText}

       Example response: { "suggestions": ["Change 'managment' to 'management'.", "The phrase 'I am responsible for...' should be rephrased to 'Responsible for...' to use an active verb." ] }`;
    } else {
      prompt = `Using the following context, improve or generate content for a resume section.
      Section: ${sectionType}
      Context: ${context}

      Provide a concise, professional response formatted as a raw string or an array of bullet points.`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (sectionType === 'ats_analysis' || sectionType === 'grammar_check') {
      try {
        const jsonResponse = JSON.parse(text);
        return NextResponse.json(jsonResponse);
      } catch (e) {
        console.error('Failed to parse AI response as JSON:', e);
        return NextResponse.json({ error: 'Failed to parse AI response.' }, { status: 500 });
      }
    }

    return NextResponse.json(text);
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}