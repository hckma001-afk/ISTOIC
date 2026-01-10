
import { HANISAH_KERNEL } from "./melsaKernel";
import { debugService } from "./debugService";

// Expanded Language Map
const LANG_MAP: Record<string, string> = {
    'INDONESIAN': 'Bahasa Indonesia (Gaul/Natural)',
    'ENGLISH': 'English (Native/Slang)',
    'JAPANESE': 'Japanese (Natural/Conversational)',
    'CHINESE': 'Mandarin (Simplified)',
    'KOREAN': 'Korean (Hangul/Conversational)',
    'SPANISH': 'Spanish (Español)',
    'FRENCH': 'French (Français)',
    'GERMAN': 'German (Deutsch)',
    'RUSSIAN': 'Russian',
    'ARABIC': 'Arabic',
    'HINDI': 'Hindi',
    'PORTUGUESE': 'Portuguese',
    'THAI': 'Thai',
    'VIETNAMESE': 'Vietnamese',
    'JAVANESE': 'Basa Jawa (Ngoko/Krama depends on context)',
    'SUNDANESE': 'Basa Sunda'
};

export const TranslationService = {
    
    /**
     * DeepL is temporarily disabled as per user request.
     * We return false to force LLM usage.
     */
    isDeepLAvailable: (): boolean => {
        return false; 
    },

    /**
     * Maps user friendly language names to detailed prompts.
     */
    mapLanguage: (lang: string): string => {
        const upper = lang.toUpperCase();
        // Check exact match in map
        if (LANG_MAP[upper]) return LANG_MAP[upper];
        
        // Partial matches
        if (upper.includes('INDO')) return LANG_MAP['INDONESIAN'];
        if (upper.includes('ENG')) return LANG_MAP['ENGLISH'];
        if (upper.includes('JPN') || upper.includes('JEPANG')) return LANG_MAP['JAPANESE'];
        if (upper.includes('KOR')) return LANG_MAP['KOREAN'];
        
        return lang; // Fallback to raw string
    },

    /**
     * Executes translation via Hydra Kernel (LLM) with Linguist Persona.
     * Powerful, Context-Aware, and Strict.
     */
    translate: async (text: string, targetLangLabel: string): Promise<string> => {
        const targetLang = TranslationService.mapLanguage(targetLangLabel);
        debugService.log('INFO', 'HYDRA_TRANS', 'REQ', `Translating to ${targetLang}...`);

        const systemPrompt = `
Anda adalah penerjemah pesan chat profesional dan ahli bahasa (Linguist). 
Tugas Anda adalah menerjemahkan pesan chat agar terdengar sangat natural, modern, dan sesuai konteks.

ATURAN UTAMA:
1. JANGAN kaku. Gunakan bahasa gaul/slang jika pesan aslinya santai.
2. JANGAN gunakan bahasa kamus/formal jika konteksnya adalah chat antar teman.
3. PAHAMI IDIOM: Jika ada kata kiasan, cari padanannya yang tepat di bahasa target, jangan diterjemahkan harfiah.
4. KHUSUS INDONESIA: Gunakan bahasa percakapan sehari-hari yang luwes (seperti penggunaan 'aku/kamu', atau akhiran 'kok', 'sih', 'nih' tergantung konteks pesan).
5. KHUSUS ENGLISH: Gunakan phrasal verbs dan ekspresi native yang umum digunakan dalam chatting.
6. PERTAHANKAN EMOJI: Jangan hapus atau ubah posisi emoji.
7. JANGAN MEMBALAS: Anda bukan asisten. Anda adalah alat. Jangan pernah berkata "Tentu", "Ini artinya", atau "Halo". 
8. OUTPUT HANYA HASIL TERJEMAHAN.

[INPUT CONTEXT]
Original Text: "${text}"
Target Language: "${targetLang}"

[OUTPUT]
Langsung berikan hasil terjemahannya saja tanpa penjelasan apa pun.
`;

        try {
            // Use 'auto-best' to let Hydra pick the smartest available model (Gemini Pro/Llama 3/GPT-4o)
            // Passing empty array for contextNotes as it's not needed for pure translation
            const response = await HANISAH_KERNEL.execute(systemPrompt, 'auto-best', []);
            
            let result = response.text || text;

            // Cleanup: Sometimes LLMs add quotes or markdown blocks despite instructions
            result = result.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
            result = result.replace(/```.*?```/gs, (match) => match.replace(/```/g, '')); // Strip code blocks markers if any

            return result.trim();

        } catch (error: any) {
            debugService.log('ERROR', 'HYDRA_TRANS', 'FAIL', error.message);
            // Fallback: Return original text if AI fails so the user doesn't lose their message
            return text; 
        }
    }
};
