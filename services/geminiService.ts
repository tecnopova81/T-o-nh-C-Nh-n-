
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { AspectRatio } from '../types';

const MODEL_NAME = "gemini-2.5-flash-image-preview";

let ai: GoogleGenAI | null = null;

function getAIInstance(): GoogleGenAI {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export const editImage = async (
  imagePart: Part,
  userPrompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  const genAI = getAIInstance();
  
  const masterPrompt = `
    IMPORTANT INSTRUCTION: You are an expert photo editor for personal branding. Your task is to edit the provided image based on the user's request.
    
    **CRITICAL RULE: You MUST preserve the subject's facial features and identity 100%. The final image must look exactly like the same person.** Do not alter their face, skin tone, or unique characteristics.

    **QUALITY & STYLE:**
    - The final image quality must be 8K, super sharp, and hyper-realistic, resembling a photo taken with a high-end professional DSLR camera.
    - Apply the user's requested style changes to the background, clothing, lighting, and overall mood.
    
    **ASPECT RATIO:**
    - The output image MUST have a ${aspectRatio} aspect ratio (${aspectRatio === AspectRatio.Square ? 'square' : aspectRatio === AspectRatio.Landscape ? 'landscape/horizontal' : 'portrait/vertical'}).

    **USER'S REQUEST:** "${userPrompt}"

    Now, generate the edited image.
  `;

  try {
    const result = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          imagePart,
          { text: masterPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const candidate = result.candidates?.[0];
    if (!candidate || !candidate.content.parts) {
      throw new Error("No content returned from the API.");
    }

    const imageResultPart = candidate.content.parts.find(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));

    if (imageResultPart && imageResultPart.inlineData) {
      return imageResultPart.inlineData.data;
    } else {
      const textPart = candidate.content.parts.find(part => part.text);
      if (textPart && textPart.text) {
          throw new Error(`API returned text instead of an image: ${textPart.text}`);
      }
      throw new Error("The API did not return a valid image. Please try again with a different prompt.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the AI.");
  }
};
