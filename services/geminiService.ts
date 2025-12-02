import { GoogleGenAI, Type } from "@google/genai";
import { Skill } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProfessionalBio = async (
  fullName: string,
  title: string,
  company: string,
  keywords: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `Write a professional, modern, and engaging professional bio (maximum 50 words) for a digital business card.
    Name: ${fullName}
    Title: ${title}
    Company: ${company}
    Key Context/Skills: ${keywords}
    
    Tone: Professional yet approachable. Use active voice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Could not generate bio.";
  } catch (error) {
    console.error("Error generating bio:", error);
    throw error;
  }
};

export const suggestSkills = async (title: string, industry: string): Promise<Skill[]> => {
  try {
    const ai = getAiClient();
    const prompt = `Suggest 6 core professional competencies/skills for a "${title}" in the "${industry}" industry for a radar chart visualization.
    Return ONLY a JSON array. Each item should have a 'subject' (skill name, max 12 chars) and a 'A' (suggested proficiency level between 60 and 95).
    
    Example output format:
    [
      { "subject": "Leadership", "A": 85 },
      { "subject": "Coding", "A": 90 }
    ]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    subject: { type: Type.STRING },
                    A: { type: Type.NUMBER }
                }
            }
        }
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    // Ensure we map it correctly to our Skill type structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawData.map((item: any) => ({
      subject: item.subject,
      A: item.A,
      fullMark: 100
    })).slice(0, 6);

  } catch (error) {
    console.error("Error suggesting skills:", error);
    // Fallback
    return [
      { subject: 'Communication', A: 85, fullMark: 100 },
      { subject: 'Problem Solving', A: 90, fullMark: 100 },
      { subject: 'Teamwork', A: 80, fullMark: 100 },
      { subject: 'Adaptability', A: 75, fullMark: 100 },
      { subject: 'Creativity', A: 85, fullMark: 100 },
      { subject: 'Work Ethic', A: 95, fullMark: 100 },
    ];
  }
};