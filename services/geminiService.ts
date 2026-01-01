
import { GoogleGenAI, Type } from "@google/genai";
import { Task, AIInsights } from "../types";

export const getTaskBreakdown = async (taskText: string): Promise<string[]> => {
  try {
    // Create instance inside the function to ensure the latest process.env.API_KEY is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini breakdown error:", error);
    return [];
  }
};

export const getDailyInsights = async (tasks: Task[]): Promise<AIInsights> => {
  if (tasks.length === 0) {
    return {
      productivityScore: 0,
      summary: "Add some tasks to start getting AI insights!",
      suggestions: ["Start by listing your top 3 goals for today."]
    };
  }

  const taskSummary = tasks.map(t => `${t.text} (${t.completed ? 'Completed' : 'Pending'})`).join(', ');
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini insights error:", error);
    return {
      productivityScore: 0,
      summary: "Could not generate insights at this time.",
      suggestions: ["Check your internet connection and API key status."]
    };
  }
};
