import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';
import {
  UserContext,
  GeminiRecommendationsResult,
  GeminiResumeResult,
  GeminiRoadmapResult,
} from '../types';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// ─── Career Recommendations ───────────────────────────────────────────────────

export const generateCareerRecommendations = async (
  userContext: UserContext
): Promise<GeminiRecommendationsResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Course or action title' },
            reason: { type: Type.STRING, description: 'Why it is recommended' },
            type: {
              type: Type.STRING,
              description: 'Must be one of: Course, Project, Soft Skill',
            },
          },
          required: ['title', 'reason', 'type'],
        },
      },
    },
    required: ['recommendations'],
  };

  const prompt = `You are an expert career coach. Based on the following user profile, generate exactly 3 specific, actionable recommendations.
User Profile: ${JSON.stringify(userContext)}`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.7 },
  });

  return JSON.parse(response.text || '{}') as GeminiRecommendationsResult;
};

// ─── Resume Analysis ──────────────────────────────────────────────────────────

export const analyzeResumeContent = async (
  resumeText: string,
  targetRole: string
): Promise<GeminiResumeResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      atsScore: {
        type: Type.INTEGER,
        description: 'ATS match score out of 100',
      },
      missingSkills: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            priority: { type: Type.STRING, description: 'High, Medium, or Low' },
            type: { type: Type.STRING, description: 'Technical or Soft Skill' },
          },
          required: ['name', 'priority', 'type'],
        },
      },
      suggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            desc: { type: Type.STRING },
          },
          required: ['title', 'desc'],
        },
      },
    },
    required: ['atsScore', 'missingSkills', 'suggestions'],
  };

  const prompt = `You are a strict ATS system and Senior Tech Recruiter.
Target Role: ${targetRole}
Resume:
---
${resumeText}
---
Analyze against the role. Return an ATS score (0-100), missing skills, and 3 actionable improvement suggestions.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.2 },
  });

  return JSON.parse(response.text || '{}') as GeminiResumeResult;
};

// ─── AI Career Chat ───────────────────────────────────────────────────────────

export const chatWithAI = async (
  message: string,
  contextMemory: string
): Promise<string> => {
  const systemInstruction = `You are SkillPilot AI — an empathetic, expert Senior Career Coach.
Keep responses concise, actionable, and encouraging.
User context: ${contextMemory}`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: message,
    config: { systemInstruction, temperature: 0.7 },
  });

  return response.text ?? '';
};

// ─── Roadmap Generation ───────────────────────────────────────────────────────

export const generateRoadmapNodes = async (
  targetRole: string,
  currentSkills: string[]
): Promise<GeminiRoadmapResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      nodes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Step title' },
            type: {
              type: Type.STRING,
              description: 'Must be one of: Course, Project, Milestone',
            },
          },
          required: ['title', 'type'],
        },
      },
    },
    required: ['nodes'],
  };

  const prompt = `You are an expert career roadmap designer.
Target Role: ${targetRole}
Current Skills: ${currentSkills.join(', ')}

Create a realistic, sequential learning roadmap with 8-10 steps to get from the user's current skills to the target role. Mix courses, projects, and milestones.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.5 },
  });

  return JSON.parse(response.text || '{}') as GeminiRoadmapResult;
};
