/**
 * Gemini REST API を直接呼び出す（SDKを使わない）
 * v1beta でダメなら v1 を試す。モデルも複数試す。
 */

const MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-pro',
];

const API_VERSIONS = ['v1beta', 'v1'];

export async function chatCompletion(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY が設定されていません。Google AI Studio (https://aistudio.google.com/apikey) で無料のAPIキーを取得してください。'
    );
  }

  const envModel = process.env.GEMINI_MODEL;
  const modelsToTry = envModel ? [envModel, ...MODELS.filter(m => m !== envModel)] : MODELS;

  // Gemini 形式に変換
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = JSON.stringify({
    contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2000,
    },
  });

  // 全組み合わせを試す
  const errors: string[] = [];

  for (const version of API_VERSIONS) {
    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`Gemini OK: ${version}/${model}`);
            return text;
          }
        }

        const errData = await response.json().catch(() => ({}));
        const errMsg = `${version}/${model}: ${response.status} ${JSON.stringify(errData?.error?.message || '').slice(0, 100)}`;
        errors.push(errMsg);
        console.log(`Gemini failed: ${errMsg}`);
      } catch (e) {
        const errMsg = `${version}/${model}: ${e instanceof Error ? e.message : String(e)}`;
        errors.push(errMsg);
      }
    }
  }

  throw new Error(
    `すべてのGeminiモデルで失敗しました。APIキーの無料枠が利用可能か確認してください。\n${errors.join('\n')}`
  );
}
