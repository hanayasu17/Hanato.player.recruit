import fs from 'fs/promises';
import path from 'path';
import { JournalEntry } from '@/types';

function getJournalDir(): string {
  return process.env.JOURNAL_DIR || path.join(process.cwd(), 'journals');
}

/**
 * 日誌を JSON として保存
 */
export async function saveJournal(entry: JournalEntry): Promise<void> {
  const dir = getJournalDir();
  await fs.mkdir(dir, { recursive: true });

  const filename = `${entry.date}_${entry.id}.json`;
  const filepath = path.join(dir, filename);
  await fs.writeFile(filepath, JSON.stringify(entry, null, 2), 'utf-8');

  // Markdown 版も同時保存
  const mdFilename = `${entry.date}_${entry.id}.md`;
  const mdPath = path.join(dir, mdFilename);
  await fs.writeFile(mdPath, journalToMarkdown(entry), 'utf-8');
}

/**
 * 日誌一覧を取得（日付降順）
 */
export async function listJournals(): Promise<
  Array<{ id: string; date: string; createdAt: string; preview: string }>
> {
  const dir = getJournalDir();
  try {
    const files = await fs.readdir(dir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    const entries = await Promise.all(
      jsonFiles.map(async (f) => {
        const content = await fs.readFile(path.join(dir, f), 'utf-8');
        const entry: JournalEntry = JSON.parse(content);
        return {
          id: entry.id,
          date: entry.date,
          createdAt: entry.createdAt,
          preview: entry.organized?.facts?.slice(0, 80) || entry.transcription.slice(0, 80),
        };
      })
    );

    return entries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

/**
 * 特定の日誌を取得
 */
export async function getJournal(id: string): Promise<JournalEntry | null> {
  const dir = getJournalDir();
  try {
    const files = await fs.readdir(dir);
    const target = files.find((f) => f.includes(id) && f.endsWith('.json'));
    if (!target) return null;
    const content = await fs.readFile(path.join(dir, target), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * JournalEntry を Markdown に変換
 */
function journalToMarkdown(entry: JournalEntry): string {
  return `# 心情日誌 ${entry.date}

---

## 文字起こし

${entry.transcription}

---

## 整理

### 【事実】
${entry.organized.facts}

### 【感情】
${entry.organized.emotions}

### 【気づき】
${entry.organized.insights}

---

## 神様の視点

**問いかけ:** ${entry.godsViewQuestion}

**あなたの回答:** ${entry.userGodsViewAnswer}

**フィードバック:** ${entry.godsFeedback}

---

## 霊的戦いの分別

### 勝利した点
${entry.spiritualBattle.victories}

### 分別のポイント
${entry.spiritualBattle.discernmentPoints}

---

## 結び

### 【今日の捧げもの】
${entry.closing.offering}

### 【明日の出陣】
${entry.closing.tomorrowResolve}

### 【終わりの祈り】
${entry.closing.prayer}

---

_記録日時: ${entry.createdAt}_
`;
}
