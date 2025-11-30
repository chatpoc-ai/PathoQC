import { GoogleGenAI } from "@google/genai";
import { QCResult } from "../types";

// Note: In a real production app, ensure this key is not exposed to the client directly via env vars if possible,
// or use a proxy server. For this demo, we assume process.env.API_KEY is available.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const analyzeQCTrends = async (data: QCResult[]): Promise<string> => {
  if (!apiKey) return "API Key not configured. Unable to perform AI analysis.";

  // Prepare a textual representation of the data for the model
  const dataSummary = data.map(d => 
    `Date: ${d.timestamp}, Value: ${d.value}, Status: ${d.status}`
  ).join('\n');

  const prompt = `
    You are a Quality Control expert in a clinical pathology laboratory.
    Analyze the following quality control data points for Hemoglobin A1c.
    Mean is 100, SD is 5.
    
    Data:
    ${dataSummary}

    Identify any Levey-Jennings rules that are violated (e.g., 1-3s, 2-2s, R-4s, shift, trend).
    Provide a concise summary of the instrument status and 3 actionable recommendations.
    Do not use markdown formatting heavily, keep it plain text or simple bullets.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating analysis. Please check your API key and connection.";
  }
};

export const generateSOPDraft = async (title: string, context: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  const prompt = `
    Create a detailed Standard Operating Procedure (SOP) for a medical laboratory.
    Title: ${title}
    Context/Specific Requirements: ${context}

    Format the output with the following sections:
    1. Purpose
    2. Scope
    3. Materials/Equipment
    4. Procedure (Step-by-step)
    5. Safety Precautions

    Make it professional, compliant with CLIA/CAP standards, and ready for review.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text || "No draft generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating SOP. Please check your API key.";
  }
};
