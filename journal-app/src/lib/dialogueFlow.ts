import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  DialogueStep,
  DialogueMessage,
  JournalEntry,
  OrganizedContent,
  SpiritualBattle,
  ClosingPrayer,
} from '@/types';
import { chatCompletion } from './openai';
import {
  SYSTEM_PROMPT,
  buildOrganizePrompt,
  buildGodsFeedbackPrompt,
  buildClosingPrompt,
} from './systemPrompt';
import { saveJournal } from './journalStore';

/**
 * セッション状態（サーバーサイドのインメモリ管理）
 * 本番では Redis 等に置き換え可能
 */
interface Session {
  id: string;
  step: DialogueStep;
  transcription: string;
  organizedRaw: string;
  organized: OrganizedContent;
  godsViewQuestion: string;
  userGodsViewAnswer: string;
  godsFeedback: string;
  spiritualBattleRaw: string;
  spiritualBattle: SpiritualBattle;
  closing: ClosingPrayer;
  dialogueHistory: DialogueMessage[];
}

const sessions = new Map<string, Session>();

function createSession(): Session {
  const id = uuidv4();
  const session: Session = {
    id,
    step: 'idle',
    transcription: '',
    organizedRaw: '',
    organized: { facts: '', emotions: '', insights: '' },
    godsViewQuestion: '',
    userGodsViewAnswer: '',
    godsFeedback: '',
    spiritualBattleRaw: '',
    spiritualBattle: { victories: '', discernmentPoints: '' },
    closing: { offering: '', tomorrowResolve: '', prayer: '' },
    dialogueHistory: [],
  };
  sessions.set(id, session);
  return session;
}

function addMessage(
  session: Session,
  role: 'user' | 'assistant',
  content: string,
  step: DialogueStep
): DialogueMessage {
  const msg: DialogueMessage = {
    id: uuidv4(),
    role,
    content,
    step,
    timestamp: new Date().toISOString(),
  };
  session.dialogueHistory.push(msg);
  return msg;
}

/**
 * ステップ1: 文字起こし結果を受け取り、整理 + 神様の視点への問いかけを行う
 */
export async function startDialogue(transcription: string): Promise<{
  sessionId: string;
  message: string;
  step: DialogueStep;
}> {
  const session = createSession();
  session.transcription = transcription;
  session.step = 'organizing';

  const prompt = buildOrganizePrompt(transcription);
  const response = await chatCompletion(SYSTEM_PROMPT, [
    { role: 'user', content: prompt },
  ]);

  // レスポンスを解析して整理内容を抽出
  const organized = parseOrganized(response);
  session.organized = organized;
  session.organizedRaw = response;
  session.step = 'awaiting_gods_perspective';

  // 問いかけを抽出（最後の問い部分）
  session.godsViewQuestion =
    '今日という一日、そして今のあなたの姿を見て、神様はどう思われている（感じておられる）と思いますか？';

  addMessage(session, 'assistant', response, 'awaiting_gods_perspective');

  return {
    sessionId: session.id,
    message: response,
    step: 'awaiting_gods_perspective',
  };
}

/**
 * ステップ2→3: ユーザーの「神様の視点」回答を受け取り、フィードバック + 霊的分別
 */
export async function processGodsViewAnswer(
  sessionId: string,
  userAnswer: string
): Promise<{
  message: string;
  step: DialogueStep;
}> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');

  session.userGodsViewAnswer = userAnswer;
  session.step = 'gods_feedback';

  addMessage(session, 'user', userAnswer, 'gods_feedback');

  const prompt = buildGodsFeedbackPrompt(session.organizedRaw, userAnswer);
  const response = await chatCompletion(SYSTEM_PROMPT, [
    { role: 'user', content: session.organizedRaw },
    { role: 'assistant', content: session.organizedRaw },
    { role: 'user', content: userAnswer },
    { role: 'user', content: prompt },
  ]);

  session.godsFeedback = response;
  session.spiritualBattleRaw = response;
  session.spiritualBattle = parseSpiritualBattle(response);
  session.step = 'spiritual_battle';

  addMessage(session, 'assistant', response, 'spiritual_battle');

  return {
    message: response,
    step: 'spiritual_battle',
  };
}

/**
 * ステップ4: 結びの祈りを生成し、日誌を保存
 */
export async function generateClosing(sessionId: string): Promise<{
  message: string;
  step: DialogueStep;
  journalId: string;
}> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');

  session.step = 'closing_prayer';

  const prompt = buildClosingPrompt(
    session.organizedRaw,
    session.spiritualBattleRaw
  );
  const response = await chatCompletion(SYSTEM_PROMPT, [
    ...session.dialogueHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: prompt },
  ]);

  session.closing = parseClosing(response);
  session.step = 'completed';

  addMessage(session, 'assistant', response, 'completed');

  // 日誌を保存
  const journalEntry: JournalEntry = {
    id: session.id,
    date: format(new Date(), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    transcription: session.transcription,
    organized: session.organized,
    godsViewQuestion: session.godsViewQuestion,
    userGodsViewAnswer: session.userGodsViewAnswer,
    godsFeedback: session.godsFeedback,
    spiritualBattle: session.spiritualBattle,
    closing: session.closing,
    dialogueHistory: session.dialogueHistory,
  };

  await saveJournal(journalEntry);

  // セッションクリーンアップ
  sessions.delete(sessionId);

  return {
    message: response,
    step: 'completed',
    journalId: journalEntry.id,
  };
}

// --- パース・ヘルパー ---

function parseOrganized(text: string): OrganizedContent {
  const facts = extractSection(text, '事実') || '';
  const emotions = extractSection(text, '感情') || '';
  const insights = extractSection(text, '気づき') || '';
  return { facts, emotions, insights };
}

function parseSpiritualBattle(text: string): SpiritualBattle {
  const victories = extractSection(text, '勝利') || '';
  const discernmentPoints = extractSection(text, '分別') || '';
  return { victories, discernmentPoints };
}

function parseClosing(text: string): ClosingPrayer {
  const offering = extractSection(text, '今日の捧げもの') || '';
  const tomorrowResolve = extractSection(text, '明日の出陣') || '';
  const prayer = extractSection(text, '終わりの祈り') || extractSection(text, '祈り') || '';
  return { offering, tomorrowResolve, prayer };
}

function extractSection(text: string, keyword: string): string | null {
  // 【keyword】 の後のテキストを次の【】まで抽出
  const regex = new RegExp(`【[^】]*${keyword}[^】]*】\\s*([\\s\\S]*?)(?=【|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}
