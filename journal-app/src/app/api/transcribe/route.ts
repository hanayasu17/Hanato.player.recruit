import { NextRequest, NextResponse } from 'next/server';
import { startDialogue } from '@/lib/dialogueFlow';

/**
 * POST /api/transcribe
 * ブラウザの Web Speech API で文字起こし済みのテキストを受け取り、
 * ステップ1（整理 + 問いかけ）を実行する。
 *
 * Body: { text: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'テキストが空です。音声で語るか、テキストを入力してください。' },
        { status: 400 }
      );
    }

    const transcription = text.trim();

    // ステップ1: 整理 + 神様の視点への問いかけ
    const result = await startDialogue(transcription);

    return NextResponse.json({
      sessionId: result.sessionId,
      transcription,
      message: result.message,
      step: result.step,
    });
  } catch (error) {
    console.error('Transcribe error:', error);
    const message =
      error instanceof Error ? error.message : '処理中にエラーが発生しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
