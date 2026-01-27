/**
 * Gemini REST API を直接呼び出す（SDKを使わない）
 * v1 を優先し、systemInstruction はメッセージに埋め込む。
 */

const MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-pro',
];

const API_VERSIONS = ['v1', 'v1beta'];

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

  // システムプロンプトを最初のユーザーメッセージに埋め込む
  const contentsWithSystem = messages.map((m, i) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{
      text: i === 0 && m.role !== 'assistant'
        ? `【あなたの役割】\n${systemPrompt}\n\n【ユーザーの入力】\n${m.content}`
        : m.content,
    }],
  }));

  // 全組み合わせを試す
  const errors: string[] = [];

  for (const version of API_VERSIONS) {
    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;

      const payload: Record<string, unknown> = {
        contents: contentsWithSystem,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000,
        },
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`Gemini OK: ${version}/${model}`);
            return text;
          }
        }

        const errText = await response.text().catch(() => '');
        const errMsg = `${version}/${model}: ${response.status} ${errText.slice(0, 120)}`;
        errors.push(errMsg);
        console.log(`Gemini skip: ${errMsg}`);
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
