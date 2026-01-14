import { describe, it, expect, beforeEach } from 'vitest';
import { HANISAH_BRAIN } from '../services/melsaBrain';

// Mock localStorage for Persona checks
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('HANISAH_BRAIN Logic Core', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('app_language', 'id');
  });

  it('should generate correct System Instruction for HANISAH persona', async () => {
    const prompt = await HANISAH_BRAIN.getSystemInstruction('hanisah');
    expect(prompt).toContain('SYSTEM_IDENTITY: HANISAH_V25_TITANIUM');
    expect(prompt).toContain('Hyper-Intelligent Digital Partner');
  });

  it('should generate correct System Instruction for STOIC persona', async () => {
    const prompt = await HANISAH_BRAIN.getSystemInstruction('stoic');
    expect(prompt).toContain('SYSTEM_IDENTITY: STOIC_AURELIUS_TITANIUM');
    expect(prompt).toContain('Philosopher-King');
  });

  it('should verify Hanisah includes Singing/Performance instructions', async () => {
    const prompt = await HANISAH_BRAIN.getSystemInstruction('hanisah');
    expect(prompt).toContain('SING WHEN ASKED');
    expect(prompt).toContain('Modulate your pitch, rhythm, and cadence');
    expect(prompt).toContain('Hmm~');
  });

  it('should verify Stoic strict rules (No Slang, No Images)', async () => {
    const prompt = await HANISAH_BRAIN.getSystemInstruction('stoic');
    expect(prompt).toContain('Dichotomy of Control');
    expect(prompt).toContain('Do not offer Image Generation unless it is strictly for diagrams');
    expect(prompt).toContain('Do not use slang/colloquialisms');
    expect(prompt).not.toContain('Sing for me');
  });

  it('should include user context properly when provided', async () => {
    const context = 'User is debugging a React application race condition.';
    const prompt = await HANISAH_BRAIN.getSystemInstruction('stoic', context);
    expect(prompt).toContain('=== ACTIVE MEMORY (RAG CONTEXT) ===');
    expect(prompt).toContain(context);
    const idxIdentity = prompt.indexOf('SYSTEM_IDENTITY: STOIC_AURELIUS_TITANIUM');
    const idxContext = prompt.indexOf(context);
    expect(idxContext).toBeGreaterThan(idxIdentity);
  });
});
