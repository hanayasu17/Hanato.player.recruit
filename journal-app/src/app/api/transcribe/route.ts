import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/openai';
import { startDialogue } from '@/lib/dialogueFlow';

/**
 * POST /api/transcribe
 * 音声ファイルを受け取り、文字起こし → ステップ1（整理 + 問いかけ）まで実行
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: '音声ファイルが見つかりません' },
        { status: 400 }
      );
    }

    // サポートする形式の確認
    const supportedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/mp4',
      'audio/m4a',
      'audio/x-m4a',
      'audio/wav',
      'audio/webm',
      'audio/ogg',
    ];
    if (
      audioFile.type &&
      !supportedTypes.some((t) => audioFile.type.includes(t)) &&
      !audioFile.name.match(/\.(mp3|m4a|wav|webm|ogg|mp4)$/i)
    ) {
      return NextResponse.json(
        { error: '対応していない音声形式です。MP3, M4A, WAV, WebM, OGG をお使いください。' },
        { status: 400 }
      );
    }

    // ステップ1: Whisper で文字起こし
    const transcription = await transcribeAudio(audioFile);

    // ステップ1→2: 整理 + 神様の視点への問いかけ
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
      error instanceof Error ? error.message : '文字起こし中にエラーが発生しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
