import { NextRequest, NextResponse } from 'next/server';
import { processGodsViewAnswer, generateClosing } from '@/lib/dialogueFlow';

/**
 * POST /api/dialogue
 * 対話の次のステップを処理
 *
 * Body:
 *   { sessionId: string, action: 'gods_view_answer' | 'generate_closing', userMessage?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action, userMessage } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'セッションIDが必要です' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'gods_view_answer': {
        if (!userMessage) {
          return NextResponse.json(
            { error: 'メッセージを入力してください' },
            { status: 400 }
          );
        }

        const result = await processGodsViewAnswer(sessionId, userMessage);
        return NextResponse.json({
          message: result.message,
          step: result.step,
        });
      }

      case 'generate_closing': {
        const result = await generateClosing(sessionId);
        return NextResponse.json({
          message: result.message,
          step: result.step,
          journalId: result.journalId,
        });
      }

      default:
        return NextResponse.json(
          { error: '不明なアクションです' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Dialogue error:', error);
    const message =
      error instanceof Error ? error.message : '対話処理中にエラーが発生しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
