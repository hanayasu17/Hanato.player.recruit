# Hanato Player Recruit - Project Guide

## Project Overview
"花人-Hanato-" のプレイヤー採用サイト。「教えるを仕事にする」をコンセプトに、健康・情報・希望・創造の4つの分野で講師/代理店として活動する人材を募集するリクルートページ。

## Tech Stack
- HTML5 / CSS3 / Vanilla JavaScript
- Single-page application (index.html)
- Google Fonts: Noto Serif JP, Zen Kaku Gothic New
- Form: Formspree (https://formspree.io/f/xqeeagql)
- Hosting: GitHub Pages

## Project Structure
```
/
├── index.html          # メインページ（HTML/CSS/JS一体型）
├── .claude/
│   ├── CLAUDE.md       # このファイル
│   └── settings.json   # Claude Code設定
└── .git/
```

## Design System

### Color Palette
| Variable             | Color   | Usage              |
|---------------------|---------|--------------------|
| --color-ink         | #1a1a1a | テキスト・ダーク背景 |
| --color-paper       | #faf9f7 | ライト背景          |
| --color-sakura      | #e8b4b8 | アクセント（桜）     |
| --color-sakura-deep | #c4848a | アクセント（深桜）   |
| --color-gold        | #b8a067 | 創造カード          |
| --color-green       | #7a9e7e | 希望カード          |
| --color-blue        | #6b8e9f | 情報カード          |
| --color-warmgray    | #8a8680 | サブテキスト        |

### Typography
- Serif: `Noto Serif JP` (見出し、ブランド)
- Sans-serif: `Zen Kaku Gothic New` (本文)

### Sections
1. Navigation (fixed top)
2. Hero - メインビジュアル
3. Philosophy - 理念
4. Paths - 4つの道（健康/情報/希望/創造）
5. Why - 選ばれる理由
6. Vision - ビジョン
7. Profile - 代表紹介（永田安孝）
8. CTA - 行動喚起
9. Contact - お問い合わせフォーム
10. Footer

## Coding Conventions
- Japanese content with English section labels
- CSS custom properties for theming
- BEM-like class naming (section-element pattern)
- Scroll-triggered animations via IntersectionObserver
- Mobile-first responsive design (breakpoints: 600px, 900px)
- All code in a single index.html file

## Key Notes
- Language: Japanese (lang="ja")
- Business: 家庭用医療機器代理店、通信事業代理店、NPO活動
- Founder: 永田安孝 (Yasutaka Nagata)
- Address: 東京都杉並区成田東1丁目40-12
- The form currently has `e.preventDefault()` with an alert - Formspree integration is set up but JS blocks actual submission
