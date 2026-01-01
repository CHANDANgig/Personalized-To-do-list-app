
import { GoogleGenAI, Type } from "@google/genai";
import { Task, AIInsights } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTaskBreakdown = async (taskText: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down this task into 3-5 actionable sub-tasks: "${taskText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini breakdown error:", error);
    return [];
  }
};

export const getDailyInsights = async (tasks: Task[]): Promise<AIInsights> => {
  const taskSummary = tasks.map(t => `${t.text} (${t.completed ? 'Completed' : 'Pending'})`).join(', ');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these tasks and provide productivity insights: ${taskSummary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productivityScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['productivityScore', 'summary', 'suggestions']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini insights error:", error);
    return {
      productivityScore: 0,
      summary: "Could not generate insights at this time.",
      suggestions: []
    };
  }
};
