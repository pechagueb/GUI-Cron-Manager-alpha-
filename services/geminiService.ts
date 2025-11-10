// Fix: Refactored to use build-time environment variable for API key and synchronous initialization.
import { GoogleGenAI, Type } from "@google/genai";

// The API_KEY is injected at build time by esbuild.
// If it's not available during build, the application is non-functional.
if (!process.env.API_KEY) {
  throw new Error("CRITICAL ERROR: Gemini API Key not found. Please set the API_KEY environment variable before building the application.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are an expert in cron syntax. Your task is to convert a natural language description of a schedule into a standard 5-field cron string (minute, hour, day of month, month, day of week).
Respond ONLY with a JSON object in the format {"cron": "..."}.
For example, if the user says "every day at 5pm", you should respond with {"cron": "0 17 * * *"}.
If the prompt is "Run a script every 15 minutes", respond with {"cron": "*/15 * * * *"}.
If the prompt is "At 8:30 AM on the first day of every month", respond with {"cron": "30 8 1 * *"}.
Do not include any other text, explanations, or markdown formatting. The JSON must be valid.`;

export const getCrontabFromNaturalLanguage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                cron: {
                    type: Type.STRING,
                    description: "The generated 5-field cron string."
                }
            }
        }
      },
    });
    
    const jsonString = response.text;
    const result = JSON.parse(jsonString);

    if (result && typeof result.cron === 'string') {
        const cronParts = result.cron.split(' ');
        if (cronParts.length === 5) {
            return result.cron;
        }
    }
    throw new Error('Invalid cron string format received from API.');

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate cron schedule from your description. Please try a different phrasing.");
  }
};
