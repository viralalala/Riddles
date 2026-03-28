import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ValidationResult {
  isCorrect: boolean;
  explanation: string;
}

/**
 * Uses Gemini AI to evaluate if a user's answer is logically correct for a given riddle.
 * This handles semantic matching so that phrased answers are accepted if they are correct.
 */
export async function validateAnswer(
  riddleBody: string,
  riddleQuestion: string,
  expectedAnswers: string[],
  userAnswer: string
): Promise<ValidationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Evaluate if the user's answer is logically correct for the following riddle.
        
        Riddle Context:
        ${riddleBody}
        
        Question:
        ${riddleQuestion}
        
        Expected Answer Keywords/Examples:
        ${expectedAnswers.join(", ")}
        
        User's Answer:
        "${userAnswer}"
        
        Instructions:
        1. Be lenient with phrasing. If the user's answer means the same thing as the expected answer or solves the logic of the riddle correctly, mark it as correct.
        2. If the user's answer is a valid alternative explanation that fits all the clues, mark it as correct.
        3. Provide a brief explanation of why it is correct or incorrect.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: {
              type: Type.BOOLEAN,
              description: "Whether the user's answer is logically correct.",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief explanation of the evaluation.",
            },
          },
          required: ["isCorrect", "explanation"],
        },
      },
    });

    const result = JSON.parse(response.text || '{"isCorrect": false, "explanation": "Error parsing AI response."}');
    return result;
  } catch (error) {
    console.error("Gemini Validation Error:", error);
    // Fallback to simple string matching if AI fails
    const normalizedUser = userAnswer.toLowerCase().trim();
    const isMatch = expectedAnswers.some(a => 
      normalizedUser.includes(a.toLowerCase().trim()) || 
      a.toLowerCase().trim().includes(normalizedUser)
    );
    
    return {
      isCorrect: isMatch,
      explanation: isMatch 
        ? "Correct (Fallback matching used)." 
        : "Incorrect (Fallback matching used)."
    };
  }
}
