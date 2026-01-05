
import { GoogleGenAI, Type } from "@google/genai";
import { Habit, DailyMetrics, AIInsights } from "../types";

export const getHabitInsights = async (habits: Habit[], metrics: DailyMetrics[]): Promise<AIInsights> => {
  if (habits.length === 0) {
    return {
      productivityScore: 0,
      summary: "Add your core protocols to start your habit-forming journey.",
      suggestions: ["Set a screen time limit.", "Add a morning routine."]
    };
  }

  const habitSummary = habits.map(h => `${h.name}: ${h.completedDays.length}/${h.goal} days`).join(', ');
  const metricSummary = metrics.slice(-7).map(m => `Date: ${m.date}, Screen: ${m.screenTime}min, Mood: ${m.mood}/10`).join(' | ');
  
  try {
    // Use process.env.API_KEY directly for initialization as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a high-performance life coach. Analyze this month's data and metrics. 
      Habits: ${habitSummary}. 
      Recent Metrics: ${metricSummary}.
      Provide a productivity score (0-100), a concise summary, and 3 actionable self-correction suggestions.`,
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
    // response.text is a property, not a method; extracting text for JSON parsing
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini insights error:", error);
    return {
      productivityScore: 0,
      summary: "Coach is offline. Keep pushing through your protocols!",
      suggestions: ["Drink more water.", "Review your monthly goals manually."]
    };
  }
};
