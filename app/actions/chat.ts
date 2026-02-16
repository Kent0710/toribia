"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function chatWithContext(
    userMessage: string,
    locationName: string,
    conversationHistory: { role: "user" | "assistant"; content: string }[],
) {
    if (!userMessage.trim()) return null;

    const systemPrompt = `You are Toribia, a knowledgeable and friendly geographic assistant. The user has clicked on a location on an interactive globe and you are providing information about that place.

LOCATION: ${locationName}

You have access to Google Search grounding — use the search results provided to answer accurately.

RULES — follow these strictly:
1. If the user's question can be answered using the grounded search results, answer confidently and concisely.
2. If the grounded search results do NOT cover the user's question, say so honestly. Do NOT fabricate information. Respond with something like: "I couldn't find reliable information about that for ${locationName}. Try asking something else about this place!"
3. Keep responses conversational, informative, and concise.
4. When providing an overview (first message), highlight the most interesting aspects: history, notable landmarks, cultural highlights, cuisine, and anything unique.
5. Always stay focused on the location. If the user asks about something completely unrelated to the location, gently steer back.`;

    try {
        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            system: systemPrompt,
            tools: {
                google_search: google.tools.googleSearch({}),
            },
            messages: [
                ...conversationHistory.map((msg) => ({
                    role: msg.role as "user" | "assistant",
                    content: msg.content,
                })),
                { role: "user" as const, content: userMessage },
            ],
        });

        return text;
    } catch (error) {
        console.error("Chat Error:", error);
        return "Sorry, I encountered an error processing your question. Please try again.";
    }
}
