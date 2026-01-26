import { NextRequest, NextResponse } from 'next/server';
import { listJournals, getJournal } from '@/lib/journalStore';

/**
 * GET /api/journals
 * 日誌一覧を取得。?id=xxx で特定の日誌を取得。
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const journal = await getJournal(id);
      if (!journal) {
        return NextResponse.json(
          { error: '日誌が見つかりません' },
          { status: 404 }
        );
      }
      return NextResponse.json(journal);
    }

    const journals = await listJournals();
    return NextResponse.json({ journals });
  } catch (error) {
    console.error('Journal fetch error:', error);
    return NextResponse.json(
      { error: '日誌の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
