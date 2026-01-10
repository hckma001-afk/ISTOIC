
import { KEY_MANAGER } from "./geminiService";
import { debugService } from "./debugService";
import { SECURITY_MATRIX } from "./securityMatrix";

export interface StandardMessage {
    role: string;
    content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export async function* streamOpenAICompatible(
    provider: 'GROQ' | 'DEEPSEEK' | 'OPENAI' | 'XAI' | 'MISTRAL' | 'OPENROUTER',
    modelId: string,
    messages: StandardMessage[],
    systemInstruction?: string,
    tools: any[] = [],
    signal?: AbortSignal
): AsyncGenerator<{ text?: string; functionCall?: any; }> {

    // 1. Force Proxy Usage
    // We ignore local keys for these providers to enforce server-side routing
    // or use them only if explicitly provided for debugging.
    debugService.log('INFO', 'PROVIDER_ENGINE', 'PROXY_REDIRECT', `Routing ${provider} to /api/chat`);

    // 2. Extract Context (Simple Flattening for /api/chat compatibility)
    // The current /api/chat endpoint accepts 'message' (user) and 'context' (system).
    // We grab the last user message as the prompt.
    const lastMessage = messages[messages.length - 1];
    const userPrompt = Array.isArray(lastMessage.content) 
        ? lastMessage.content.find(c => c.type === 'text')?.text || ""
        : lastMessage.content;
    
    // Flatten history into context if needed, or just use system instruction
    // For V101 Strict Mode, we pass systemInstruction as context.
    const contextPayload = systemInstruction || "You are a helpful assistant.";

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provider: provider,
                modelId: modelId,
                message: userPrompt,
                context: contextPayload
            }),
            signal
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server Proxy Error (${response.status}): ${errText}`);
        }

        if (!response.body) throw new Error("No response body from proxy");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });

            // /api/chat sends raw text stream OR encoded tool calls
            // Standard text flow
            if (!buffer.includes("::TOOL::")) {
                 if (buffer) {
                     yield { text: buffer };
                     buffer = "";
                 }
            } else {
                // Handle Tool Markers from api/chat.ts
                const toolRegex = /::TOOL::(.*)::ENDTOOL::/s;
                let match;
                while ((match = toolRegex.exec(buffer)) !== null) {
                    const [fullMatch, jsonStr] = match;
                    const textBefore = buffer.slice(0, match.index);
                    
                    if (textBefore) yield { text: textBefore };
                    
                    try {
                        const toolData = JSON.parse(jsonStr);
                        yield { functionCall: toolData };
                    } catch (e) {
                        console.error("Proxy Tool Parse Error", e);
                    }
                    
                    buffer = buffer.slice(match.index + fullMatch.length);
                }
                
                // Yield remaining text
                if (buffer && !buffer.includes("::TOOL::")) {
                     yield { text: buffer };
                     buffer = "";
                }
            }
        }

    } catch (e: any) {
        if (e.name === 'AbortError') return;
        debugService.log('ERROR', provider, 'PROXY_FAIL', e.message);
        yield { text: `\n\n[SYSTEM ERROR: Proxy Connection Failed - ${e.message}]` };
    }
}

// Vision is complex to proxy via simple JSON. 
// For V101, we restrict Vision to Gemini (Native) or throw if proxying complex multipart is required but not implemented.
export async function analyzeMultiModalMedia(provider: string, modelId: string, data: string, mimeType: string, prompt: string): Promise<string> {
    // Only Gemini supported for Client-Side direct Vision in this version
    // or we need a dedicated /api/vision route.
    if (provider === 'GEMINI') {
        const { GoogleGenAI } = await import("@google/genai"); 
        const apiKey = KEY_MANAGER.getKey(provider);
        if (!apiKey) throw new Error(`API Key for ${provider} not found`);

        try {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: modelId || 'gemini-3-flash-preview',
                contents: { parts: [{ inlineData: { data, mimeType } }, { text: prompt }] }
            });
            KEY_MANAGER.reportSuccess('GEMINI');
            return response.text || "No response.";
        } catch (e: any) {
            KEY_MANAGER.reportFailure('GEMINI', apiKey, e);
            throw new Error(`Gemini Vision Failed: ${e.message}`);
        }
    }

    // Fallback/Block for others to prevent key leakage
    return `Secure Vision Proxy for ${provider} is not active in this build. Please use Gemini.`;
}

export async function generateMultiModalImage(provider: string, modelId: string, prompt: string, options: any): Promise<string> {
    // Re-use existing Gemini logic (Client Side is safe for Gemini if key is restricted)
    // Or route OpenAI DALL-E to server if needed.
    // For this update, we keep Gemini direct but block OpenAI direct to force implementation of a secure route later if needed.
    
    if (provider === 'GEMINI') {
        const { GoogleGenAI } = await import("@google/genai");
        const apiKey = KEY_MANAGER.getKey(provider);
        if (!apiKey) throw new Error(`API Key for ${provider} not found`);
        
        try {
            const ai = new GoogleGenAI({ apiKey });
            const validRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];
            const ratio = validRatios.includes(options?.aspectRatio) ? options.aspectRatio : "1:1";
            const targetModel = (modelId === 'gemini-2.0-flash-exp' || !modelId) ? 'gemini-2.5-flash-image' : modelId;

            const response = await ai.models.generateContent({
                model: targetModel, 
                contents: { parts: [{ text: prompt }] },
                config: { imageConfig: { aspectRatio: ratio } } 
            });
            
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    KEY_MANAGER.reportSuccess('GEMINI');
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
            throw new Error("No image data returned from Gemini.");
        } catch(e) {
            KEY_MANAGER.reportFailure('GEMINI', apiKey, e);
            throw e;
        }
    }

    throw new Error(`Provider ${provider} not supported for Image Generation in Secure Mode.`);
}
