import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

/**
 * Whisper API で音声をテキストに変換
 */
export async function transcribeAudio(file: File): Promise<string> {
  const openai = getOpenAIClient();
  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file,
    language: 'ja',
    response_format: 'text',
  });
  return response as unknown as string;
}

/**
 * LLM にメッセージを送り応答を得る
 */
export async function chatCompletion(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<string> {
  const openai = getOpenAIClient();
  const model = process.env.LLM_MODEL || 'gpt-4o';

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || '';
}
