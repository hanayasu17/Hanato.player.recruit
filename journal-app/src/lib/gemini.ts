import { GoogleGenerativeAI } from '@google/generative-ai';

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY が設定されていません。Google AI Studio (https://aistudio.google.com/apikey) で無料のAPIキーを取得してください。'
      );
    }
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

/**
 * Gemini にメッセージを送り応答を得る（無料枠で利用可能）
 */
export async function chatCompletion(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<string> {
  const genAI = getClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
  });

  // Gemini の履歴形式に変換
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({
    history,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2000,
    },
  });

  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;
  return response.text();
}
