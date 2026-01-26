/** 対話ステップの状態 */
export type DialogueStep =
  | 'idle'
  | 'uploading'
  | 'transcribing'
  | 'organizing'
  | 'awaiting_gods_perspective'
  | 'gods_feedback'
  | 'spiritual_battle'
  | 'closing_prayer'
  | 'completed';

/** 整理された日誌の内容（ステップ1） */
export interface OrganizedContent {
  facts: string;      // 【事実】
  emotions: string;   // 【感情】
  insights: string;   // 【気づき】
}

/** 霊的戦いの分別（ステップ3） */
export interface SpiritualBattle {
  victories: string;        // 勝利した点
  discernmentPoints: string; // 分別のポイント（堕落性の指摘）
}

/** 結びの祈り（ステップ4） */
export interface ClosingPrayer {
  offering: string;    // 【今日の捧げもの】
  tomorrowResolve: string; // 【明日の出陣】
  prayer: string;      // 【終わりの祈り】
}

/** 対話メッセージ */
export interface DialogueMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  step: DialogueStep;
  timestamp: string;
}

/** 日誌エントリ全体 */
export interface JournalEntry {
  id: string;
  date: string;              // YYYY-MM-DD
  createdAt: string;         // ISO timestamp
  transcription: string;     // 文字起こし原文
  organized: OrganizedContent;
  godsViewQuestion: string;  // ステップ2の問いかけ
  userGodsViewAnswer: string; // ユーザーの回答
  godsFeedback: string;      // 神様の視点フィードバック
  spiritualBattle: SpiritualBattle;
  closing: ClosingPrayer;
  dialogueHistory: DialogueMessage[];
}

/** API レスポンス型 */
export interface TranscribeResponse {
  text: string;
}

export interface DialogueResponse {
  message: string;
  step: DialogueStep;
  journalEntry?: Partial<JournalEntry>;
}

export interface JournalListResponse {
  journals: Array<{
    id: string;
    date: string;
    createdAt: string;
    preview: string;
  }>;
}
