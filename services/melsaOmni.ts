
import { HANISAH_BRAIN } from "./melsaBrain";

// ============================================================================
// HYDRA ENGINE v20.1 (Server-Side Omni-Race)
// ============================================================================

let activeController: AbortController | null = null;

interface RaceResult {
    text: string;
    model: string;
    provider: string;
}

export const stopResponse = () => {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
};

/**
 * Executes the Omni-Race on the Server Side (/api/routeomnirace).
 * This ensures all keys are handled by the edge function and bandwidth is optimized.
 */
export const runHanisahRace = async (message: string, imageData: any = null, historyContext: any[] = []): Promise<RaceResult> => {
  stopResponse();
  activeController = new AbortController();
  const signal = activeController.signal;

  // If Image Data is present, we must use a specific vision-capable route or failover to Gemini Client
  // Current /api/routeomnirace is text-only. 
  if (imageData) {
     throw new Error("Omni-Race Server does not support image input yet. Please use specific Gemini Model.");
  }

  try {
      const systemInstruction = await HANISAH_BRAIN.getSystemInstruction('hanisah');

      // Construct Context from History
      const contextString = historyContext.slice(-6).map(m => 
          `${m.role === 'user' ? 'User' : 'Assistant'}: ${Array.isArray(m.parts) ? m.parts[0].text : m.content}`
      ).join('\n');

      const response = await fetch('/api/routeomnirace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              prompt: message,
              system: systemInstruction,
              context: contextString
          }),
          signal
      });

      if (!response.ok) {
          throw new Error(`Omni-Race Server Error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let fullText = "";
      let winnerProvider = "HYDRA_SERVER";
      let winnerKeyMask = "XXXX";

      while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunkStr = decoder.decode(value, { stream: true });
          
          // Parse JSON Events from Server Stream
          // Server sends: JSON string chunks
          try {
             // Handle concatenated JSON objects
             const lines = chunkStr.split('}{').map((l, i, arr) => {
                 if (arr.length > 1) {
                     if (i === 0) return l + '}';
                     if (i === arr.length - 1) return '{' + l;
                     return '{' + l + '}';
                 }
                 return l;
             });

             for (const line of lines) {
                 try {
                     const json = JSON.parse(line);
                     if (json.text) fullText += json.text;
                     if (json.provider) winnerProvider = json.provider;
                     if (json.keyId) winnerKeyMask = json.keyId;
                 } catch (e) {
                     // If direct text is sent (fallback)
                     if (!line.trim().startsWith('{')) fullText += line;
                 }
             }
          } catch (e) {
              fullText += chunkStr;
          }
      }

      return {
          text: fullText,
          model: "HYDRA OMNI V20",
          provider: winnerProvider
      };

  } catch (e: any) {
      if (e.name === 'AbortError') throw new Error("Dibatalkan.");
      console.error("Omni-Race Error:", e);
      throw new Error("Hydra Network Unreachable. Please check connection.");
  }
};
