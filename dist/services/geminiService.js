"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoadmapNodes = exports.chatWithAI = exports.analyzeResumeContent = exports.generateCareerRecommendations = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';
// ─── Career Recommendations ───────────────────────────────────────────────────
const generateCareerRecommendations = async (userContext) => {
    const schema = {
        type: genai_1.Type.OBJECT,
        properties: {
            recommendations: {
                type: genai_1.Type.ARRAY,
                items: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        title: { type: genai_1.Type.STRING, description: 'Course or action title' },
                        reason: { type: genai_1.Type.STRING, description: 'Why it is recommended' },
                        type: {
                            type: genai_1.Type.STRING,
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
    return JSON.parse(response.text || '{}');
};
exports.generateCareerRecommendations = generateCareerRecommendations;
// ─── Resume Analysis ──────────────────────────────────────────────────────────
const analyzeResumeContent = async (resumeText, targetRole) => {
    const schema = {
        type: genai_1.Type.OBJECT,
        properties: {
            atsScore: {
                type: genai_1.Type.INTEGER,
                description: 'ATS match score out of 100',
            },
            missingSkills: {
                type: genai_1.Type.ARRAY,
                items: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        name: { type: genai_1.Type.STRING },
                        priority: { type: genai_1.Type.STRING, description: 'High, Medium, or Low' },
                        type: { type: genai_1.Type.STRING, description: 'Technical or Soft Skill' },
                    },
                    required: ['name', 'priority', 'type'],
                },
            },
            suggestions: {
                type: genai_1.Type.ARRAY,
                items: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        title: { type: genai_1.Type.STRING },
                        desc: { type: genai_1.Type.STRING },
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
    return JSON.parse(response.text || '{}');
};
exports.analyzeResumeContent = analyzeResumeContent;
// ─── AI Career Chat ───────────────────────────────────────────────────────────
const chatWithAI = async (message, contextMemory) => {
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
exports.chatWithAI = chatWithAI;
// ─── Roadmap Generation ───────────────────────────────────────────────────────
const generateRoadmapNodes = async (targetRole, currentSkills) => {
    const schema = {
        type: genai_1.Type.OBJECT,
        properties: {
            nodes: {
                type: genai_1.Type.ARRAY,
                items: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        title: { type: genai_1.Type.STRING, description: 'Step title' },
                        type: {
                            type: genai_1.Type.STRING,
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
    return JSON.parse(response.text || '{}');
};
exports.generateRoadmapNodes = generateRoadmapNodes;
