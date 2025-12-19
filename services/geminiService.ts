import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBlogContent = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a professional blog writer. Create a compelling, detailed, and SEO-optimized blog post about: "${prompt}". 
               Structure the post with clear headings (H2, H3), bullet points where appropriate, and a concluding thought. 
               Format the output in clean Markdown.`,
  });
  return response.text || '';
};

export const generateTitle = async (content: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following blog content and generate the most engaging, professional, and click-worthy title: "${content.substring(0, 1500)}". 
               Return only the title text, nothing else.`,
  });
  return response.text?.replace(/["*]/g, '').trim() || 'Untitled Post';
};

export const generateBlogPostImage = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `High-quality professional editorial photograph for a blog article about: ${prompt}. Modern aesthetic, minimal background, high resolution, 4k, soft cinematic lighting.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  return '';
};