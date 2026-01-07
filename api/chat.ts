
import { GoogleGenAI } from "@google/genai";

// Konfigurasi Edge Runtime (Wajib untuk Vercel agar streaming cepat & murah)
export const config = {
  runtime: 'edge',
};

// --- CONFIGURATION & KEYS ---
const KEYS = {
  GEMINI: process.env.GEMINI_API_KEY,
  OPENAI: process.env.OPENAI_API_KEY,
  GROQ: process.env.GROQ_API_KEY,
  DEEPSEEK: process.env.DEEPSEEK_API_KEY,
  MISTRAL: process.env.MISTRAL_API_KEY,
  OPENROUTER: process.env.OPENROUTER_API_KEY,
};

// --- MAIN HANDLER ---
export async function POST(request: Request) {
  try {
    const { message, modelId, provider, context } = await request.json();

    if (!message) return new Response("Message required", { status: 400 });

    // Tentukan Provider default jika tidak dikirim
    const activeProvider = (provider || 'GEMINI').toUpperCase();
    const activeModel = modelId || getFallbackModel(activeProvider);

    // Gabungkan Context (System Prompt)
    const finalPrompt = context ? `${context}\n\nUser: ${message}` : message;

    // --- ROUTING LOGIC ---
    switch (activeProvider) {
      case 'GEMINI':
        return await streamGemini(finalPrompt, activeModel);
      
      case 'OPENAI':
        return await streamOpenAICompatible(
          'https://api.openai.com/v1/chat/completions',
          KEYS.OPENAI,
          activeModel,
          finalPrompt
        );

      case 'GROQ':
        return await streamOpenAICompatible(
          'https://api.groq.com/openai/v1/chat/completions',
          KEYS.GROQ,
          activeModel,
          finalPrompt
        );

      case 'DEEPSEEK':
        return await streamOpenAICompatible(
          'https://api.deepseek.com/chat/completions',
          KEYS.DEEPSEEK,
          activeModel,
          finalPrompt
        );
      
      case 'MISTRAL':
        return await streamOpenAICompatible(
          'https://api.mistral.ai/v1/chat/completions',
          KEYS.MISTRAL,
          activeModel,
          finalPrompt
        );

      case 'OPENROUTER':
        return await streamOpenAICompatible(
          'https://openrouter.ai/api/v1/chat/completions',
          KEYS.OPENROUTER,
          activeModel,
          finalPrompt,
          // OpenRouter butuh header tambahan
          { 
            "HTTP-Referer": "https://istoic.app", 
            "X-Title": "IStoic AI" 
          }
        );

      default:
        return new Response(`Provider ${activeProvider} not supported`, { status: 400 });
    }

  } catch (error: any) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// --- HELPER 1: GEMINI STREAMING (New @google/genai SDK) ---
async function streamGemini(prompt: string, modelId: string) {
  if (!KEYS.GEMINI) throw new Error("GEMINI_API_KEY missing");
  
  const ai = new GoogleGenAI({ apiKey: KEYS.GEMINI });
  
  // Menggunakan SDK terbaru untuk streaming
  const result = await ai.models.generateContentStream({
    model: modelId,
    contents: prompt // SDK baru cukup kirim string jika simple
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
      } catch (e) {
          controller.error(e);
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain" } });
}

// --- HELPER 2: OPENAI-COMPATIBLE STREAMING (Raw Fetch) ---
// Fungsi ini menangani OpenAI, Groq, DeepSeek, Mistral, dll karena formatnya sama (SSE)
async function streamOpenAICompatible(
  endpoint: string, 
  apiKey: string | undefined, 
  model: string, 
  prompt: string,
  extraHeaders: Record<string, string> = {}
) {
  if (!apiKey) throw new Error(`API Key for endpoint ${endpoint} is missing`);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...extraHeaders
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content: prompt }],
      stream: true, // Wajib True untuk efek mengetik
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Provider Error (${response.status}): ${err}`);
  }

  // Transform Stream: Mengubah format "data: JSON" menjadi "text biasa"
  // Agar frontend tidak pusing parsing SSE
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      if (!reader) { controller.close(); return; }

      try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === 'data: [DONE]') continue;
              
              if (trimmed.startsWith('data: ')) {
                try {
                  const json = JSON.parse(trimmed.replace('data: ', ''));
                  // Ambil content dari delta (standard OpenAI format)
                  const content = json.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  // Ignore parse errors on partial chunks
                }
              }
            }
          }
          controller.close();
      } catch (e) {
          controller.error(e);
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain" } });
}

// --- UTILS ---
function getFallbackModel(provider: string): string {
  switch (provider) {
    case 'GEMINI': return 'gemini-3-flash-preview';
    case 'OPENAI': return 'gpt-4o-mini';
    case 'GROQ': return 'llama-3.3-70b-versatile'; // Sangat cepat
    case 'DEEPSEEK': return 'deepseek-chat';
    case 'MISTRAL': return 'mistral-medium';
    default: return 'gpt-3.5-turbo';
  }
}
