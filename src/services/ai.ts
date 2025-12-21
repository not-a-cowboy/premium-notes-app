import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateCompletion(prompt: string, apiKey: string): Promise<string> {
    if (!apiKey) throw new Error("API Key is missing");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate content. Please check your API key and try again.");
    }
}


export async function summarizeNote(content: string, apiKey: string): Promise<string> {
    const prompt = `Summarize the following note in a concise, bulleted Markdown format. Keep it brief and capture key actions or insights:\n\n${content}`;
    return generateCompletion(prompt, apiKey);
}

export async function generateTags(content: string, apiKey: string): Promise<string[]> {
    const prompt = `Generate 3-5 relevant generic tags for the following note. Return ONLY a comma-separated list of tags (e.g. work, ideas, meeting). Do not include numbering or bullets.\n\n${content}`;
    const result = await generateCompletion(prompt, apiKey);
    return result.split(',').map(tag => tag.trim());
}

export async function fixGrammar(content: string, apiKey: string): Promise<string> {
    const prompt = `Fix the grammar and spelling of the following text used in a note. Maintain the original tone and formatting. Return ONLY the corrected text:\n\n${content}`;
    return generateCompletion(prompt, apiKey);
}
