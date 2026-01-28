import Link from "next/link";
import ScrollAnimator from "@/components/ScrollAnimator";
import BlogCard from "@/components/BlogCard";
import PathCard from "@/components/PathCard";
import { getLatestPosts } from "@/lib/queries";
import type { PostCard } from "@/types/blog";

export default async function HomePage() {
  let latestPosts: PostCard[] = [];
  try {
    latestPosts = await getLatestPosts(5);
  } catch {
    // Sanity not configured yet - show page without blog posts
  }

  return (
    <>
      <ScrollAnimator />

      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 relative overflow-hidden"
        id="hero"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, rgba(232,180,184,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(184,160,103,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(122,158,126,0.05) 0%, transparent 70%)
            `,
          }}
        />
        <div className="relative z-10 max-w-[900px]">
          <p
            className="text-sm tracking-[0.3em] text-warmgray mb-8 opacity-0"
            style={{ animation: "fadeInUp 1s ease 0.3s forwards" }}
          >
            BECOME A PLAYER, NOT A USER
          </p>
          <h1
            className="font-serif font-semibold leading-tight mb-6 opacity-0"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              animation: "fadeInUp 1s ease 0.5s forwards",
            }}
          >
            <span className="text-sakura-deep relative inline-block">
              教える
              <span className="absolute bottom-[0.1em] left-0 right-0 h-[0.3em] bg-sakura/40 -z-10" />
            </span>
            を
            <br />
            仕事にする
          </h1>
          <p
            className="text-xl text-warmgray mb-12 opacity-0"
            style={{ animation: "fadeInUp 1s ease 0.7s forwards" }}
          >
            あなたの経験と想いが、誰かの人生を変える力になる。
            <br />
            創造する側へ。伝える側へ。花を咲かせる側へ。
          </p>
          <div
            className="opacity-0"
            style={{ animation: "fadeInUp 1s ease 0.9s forwards" }}
          >
            <a
              href="#paths"
              className="inline-block px-12 py-4 bg-ink text-paper no-underline text-sm tracking-[0.15em] relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-sakura-deep -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0" />
              <span className="relative z-10">プレイヤーになる</span>
            </a>
          </div>
        </div>
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-warmgray text-xs tracking-[0.2em] opacity-0"
          style={{ animation: "fadeIn 1s ease 1.5s forwards" }}
        >
          SCROLL
          <span
            className="w-px h-10"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-warmgray), transparent)",
              animation: "scrollPulse 2s ease infinite",
            }}
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 bg-ink text-paper text-center">
        <div className="max-w-[800px] mx-auto scroll-animate">
          <p className="text-xs tracking-[0.3em] text-sakura mb-8">
            PHILOSOPHY
          </p>
          <p
            className="font-serif leading-[2] font-normal"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
          >
            私たちは「<span className="text-sakura">詰まり</span>
            」を解消する。
            <br />
            体の詰まり、情報の詰まり、心の詰まり。
            <br />
            <br />
            そして今、あなたにも
            <br />
            <span className="text-sakura">解消する側</span>
            になってほしい。
          </p>
        </div>
      </section>

      {/* Paths Section */}
      <section className="py-32 px-6" id="paths">
        <div className="text-center max-w-[700px] mx-auto mb-20 scroll-animate">
          <span className="text-xs tracking-[0.3em] text-warmgray mb-6 block">
            CHOOSE YOUR PATH
          </span>
          <h2
            className="font-serif font-semibold mb-6"
            style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
          >
            あなたは、何を教えますか？
          </h2>
          <p className="text-warmgray">
            それぞれの道に、それぞれの可能性がある。
            <br />
            あなたの「教えたい」を仕事にする4つの道。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1200px] mx-auto">
          {[
            {
              icon: "💓",
              title: "健康を教える",
              subtitle: "TEACH HEALTH",
              color: "var(--color-sakura-deep)",
              desc: "家庭用医療機器を通じて、血流改善と健康の大切さを伝える。体の詰まりを解消し、人々の健康をサポートする講師・代理店として活動します。",
              points: [
                "血流改善の知識を学び、伝える",
                "体験会の開催・運営",
                "代理店として独立可能",
              ],
            },
            {
              icon: "📱",
              title: "情報を教える",
              subtitle: "TEACH CONNECTIVITY",
              color: "var(--color-blue)",
              desc: "通信環境の最適化を通じて、人と情報のつながりをサポート。複雑化するデジタル社会で、最適な選択を導く専門家として活動します。",
              points: [
                "通信プランの診断・提案",
                "デジタル活用のアドバイス",
                "代理店として収入を得る",
              ],
            },
            {
              icon: "🕊️",
              title: "希望を教える",
              subtitle: "TEACH HOPE",
              color: "var(--color-green)",
              desc: "NPO活動を通じて、命のルーツと平和の大切さを伝える。心の詰まりを解消し、子どもたちの未来に希望を届ける活動に参加します。",
              points: [
                "ボランティア活動への参加",
                "教育プログラムの企画・運営",
                "コミュニティの構築",
              ],
            },
            {
              icon: "🎨",
              title: "創造を教える",
              subtitle: "TEACH CREATIVITY",
              color: "var(--color-gold)",
              desc: "LINEスタンプ制作などのクリエイティブスキルを教える。自分の「つくる力」を活かして、創造の喜びを伝える教室を開きます。",
              points: [
                "LINEスタンプ教室の講師",
                "クリエイティブワークショップ",
                "自分の教室を持つ",
              ],
            },
          ].map((path) => (
            <PathCard key={path.title} {...path} />
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section
        className="py-32 px-6"
        style={{
          background: "linear-gradient(180deg, var(--color-paper) 0%, #f5f4f2 100%)",
        }}
        id="why"
      >
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <span className="text-xs tracking-[0.3em] text-warmgray mb-6 block">
              WHY HANATO
            </span>
            <h2
              className="font-serif font-semibold"
              style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
            >
              花人が選ばれる理由
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "経験ゼロから始められる",
                desc: "講師経験がなくても大丈夫。基礎から丁寧にサポートし、あなたのペースで成長できる環境を用意しています。",
              },
              {
                num: "02",
                title: "本業・副業どちらも",
                desc: "フルタイムでもスキマ時間でも。あなたのライフスタイルに合わせて、柔軟に活動できます。",
              },
              {
                num: "03",
                title: "仲間と一緒に成長",
                desc: "一人で頑張るのではなく、同じ志を持つ仲間と切磋琢磨。定期的な勉強会やイベントで繋がりを深めます。",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="text-center scroll-animate"
              >
                <div className="font-serif text-[3.5rem] font-semibold text-sakura leading-none mb-4">
                  {item.num}
                </div>
                <h3 className="font-serif text-xl font-semibold mb-4">
                  {item.title}
                </h3>
                <p className="text-[0.9375rem] text-warmgray">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-32 px-6 bg-ink text-paper relative overflow-hidden" id="vision">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 70%, rgba(232,180,184,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 30%, rgba(122,158,126,0.08) 0%, transparent 50%)
            `,
          }}
        />
        <div className="max-w-[900px] mx-auto relative z-10">
          <div className="text-center mb-16 scroll-animate">
            <span className="text-xs tracking-[0.3em] text-sakura mb-6 block">
              VISION
            </span>
            <h2
              className="font-serif font-semibold"
              style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
            >
              花を咲かせる人生へ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="scroll-animate">
              <h3 className="font-serif text-2xl font-semibold mb-6 text-sakura">
                なぜ「花人」なのか
              </h3>
              <p className="mb-6 opacity-90">
                美しい花を咲かせるには、3つの要素が必要です。
              </p>
              <p className="mb-6 opacity-90">
                「歴史」は根っこ。自分の命のルーツを知り、誇りを持つこと。
                <br />
                「体」は茎。健康な体が、人生を支えます。
                <br />
                「情報」は葉っぱ。経済的自由が、選択肢を広げます。
              </p>
              <p className="opacity-90">
                この3つが調和したとき、誰もが自分らしく輝く花を咲かせることができる。
                <br />
                そして私たちは、その花を咲かせる「側」に立つ人を求めています。
              </p>
            </div>
            <div className="text-center p-12 bg-white/[0.03] border border-white/10 scroll-animate">
              <div className="text-6xl mb-8">🌸</div>
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: "🌱",
                    label: "根",
                    text: "= 歴史・ルーツ",
                    bg: "rgba(122,158,126,0.3)",
                  },
                  {
                    icon: "💪",
                    label: "茎",
                    text: "= 健康な体",
                    bg: "rgba(232,180,184,0.3)",
                  },
                  {
                    icon: "🍃",
                    label: "葉",
                    text: "= 情報・経済力",
                    bg: "rgba(107,142,159,0.3)",
                  },
                ].map((part) => (
                  <div
                    key={part.label}
                    className="flex items-center gap-4 justify-center"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-base"
                      style={{ background: part.bg }}
                    >
                      {part.icon}
                    </div>
                    <div className="text-[0.9375rem]">
                      <span className="font-semibold text-sakura">
                        {part.label}
                      </span>{" "}
                      {part.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-32 px-6" id="profile">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 items-center">
          <div className="relative scroll-animate max-w-[300px] mx-auto md:max-w-none">
            <div className="absolute -top-4 -left-4 right-4 bottom-4 border border-sakura z-0" />
            <div
              className="relative z-10 aspect-[4/5] flex items-center justify-center text-white font-serif text-5xl"
              style={{
                background: "linear-gradient(135deg, var(--color-sakura) 0%, var(--color-sakura-deep) 100%)",
              }}
            >
              永田
            </div>
          </div>
          <div className="scroll-animate text-center md:text-left">
            <span className="text-xs tracking-[0.3em] text-warmgray mb-4 block">
              FOUNDER
            </span>
            <h2 className="font-serif text-3xl font-semibold mb-2">
              永田 安孝
            </h2>
            <p className="text-sm text-warmgray tracking-[0.1em] mb-8">
              YASUTAKA NAGATA
            </p>
            <p className="mb-6">
              家庭用医療機器代理店、通信事業代理店、NPO活動。一見バラバラに見える3つの取り組みですが、実は全て一つの想いで繋がっています。
            </p>
            <p className="mb-6">
              それは「詰まりを解消する」こと。体の詰まり、情報の詰まり、心の詰まり。この3つを解消することで、人は本来の力を発揮できると考えています。
            </p>
            <p className="mb-6">
              そして今、同じ想いを持つ仲間を探しています。「教える」ことで人の役に立ちたい。そんな方との出会いを心待ちにしています。
            </p>
            <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
              {[
                "家庭用医療機器代理店",
                "通信事業代理店",
                "NPO活動",
                "東アジアの平和",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-paper border border-black/10 text-[0.8125rem] text-warmgray"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      {latestPosts.length > 0 && (
        <section
          className="py-32 px-6"
          style={{
            background: "linear-gradient(180deg, #f5f4f2 0%, var(--color-paper) 100%)",
          }}
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16 scroll-animate">
              <span className="text-xs tracking-[0.3em] text-warmgray mb-6 block">
                BLOG
              </span>
              <h2
                className="font-serif font-semibold mb-6"
                style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
              >
                最新の記事
              </h2>
              <p className="text-warmgray">
                花人の活動や想いを綴ったブログです。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.slice(0, 3).map((post) => (
                <div key={post._id} className="scroll-animate">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-block px-12 py-4 border border-ink text-ink no-underline text-sm tracking-[0.15em] hover:bg-ink hover:text-paper transition-all duration-300"
              >
                すべての記事を見る
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className="py-32 px-6 text-center text-white"
        style={{
          background: "linear-gradient(135deg, var(--color-sakura) 0%, var(--color-sakura-deep) 100%)",
        }}
      >
        <div className="max-w-[700px] mx-auto scroll-animate">
          <h2
            className="font-serif font-semibold mb-6"
            style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
          >
            あなたの「教えたい」が
            <br />
            誰かの人生を変える
          </h2>
          <p className="text-lg mb-12 opacity-95">
            創造する側へ。伝える側へ。
            <br />
            一緒に花を咲かせる仲間になりませんか。
          </p>
          <a
            href="#contact"
            className="inline-block px-14 py-5 bg-white text-sakura-deep no-underline text-[0.9375rem] tracking-[0.1em] font-medium hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300"
          >
            今すぐ相談する
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 bg-ink text-paper" id="contact">
        <div className="max-w-[600px] mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <span className="text-xs tracking-[0.3em] text-sakura mb-6 block">
              CONTACT
            </span>
            <h2
              className="font-serif font-semibold text-paper mb-4"
              style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
            >
              お問い合わせ
            </h2>
            <p className="text-warmgray mt-4">
              まずは気軽にお話しましょう。
              <br />
              あなたに合った道を一緒に探します。
            </p>
          </div>

          <form
            className="scroll-animate"
            action="https://formspree.io/f/xqeeagql"
            method="POST"
          >
            <div className="mb-8">
              <label className="block text-[0.8125rem] tracking-[0.1em] mb-3 text-warmgray">
                興味のある分野 *
              </label>
              <select
                name="interest"
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 text-paper font-sans text-base focus:outline-none focus:border-sakura focus:bg-white/[0.08] transition-all duration-300"
              >
                <option value="" className="bg-ink text-paper">
                  選択してください
                </option>
                <option value="health" className="bg-ink text-paper">
                  健康を教える（医療機器）
                </option>
                <option value="info" className="bg-ink text-paper">
                  情報を教える（通信環境）
                </option>
                <option value="hope" className="bg-ink text-paper">
                  希望を教える（NPO活動）
                </option>
                <option value="create" className="bg-ink text-paper">
                  創造を教える（LINEスタンプ等）
                </option>
                <option value="all" className="bg-ink text-paper">
                  全て興味がある
                </option>
                <option value="other" className="bg-ink text-paper">
                  その他・相談したい
                </option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-[0.8125rem] tracking-[0.1em] mb-3 text-warmgray">
                お名前 *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="山田 太郎"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 text-paper font-sans text-base focus:outline-none focus:border-sakura focus:bg-white/[0.08] transition-all duration-300 placeholder:text-white/30"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[0.8125rem] tracking-[0.1em] mb-3 text-warmgray">
                メールアドレス *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="example@email.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 text-paper font-sans text-base focus:outline-none focus:border-sakura focus:bg-white/[0.08] transition-all duration-300 placeholder:text-white/30"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[0.8125rem] tracking-[0.1em] mb-3 text-warmgray">
                電話番号
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="090-0000-0000"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 text-paper font-sans text-base focus:outline-none focus:border-sakura focus:bg-white/[0.08] transition-all duration-300 placeholder:text-white/30"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[0.8125rem] tracking-[0.1em] mb-3 text-warmgray">
                メッセージ
              </label>
              <textarea
                name="message"
                placeholder="ご質問やご要望があればお書きください"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 text-paper font-sans text-base focus:outline-none focus:border-sakura focus:bg-white/[0.08] transition-all duration-300 min-h-[150px] resize-y placeholder:text-white/30"
              />
            </div>

            <div className="text-center mt-12">
              <button
                type="submit"
                className="px-16 py-5 bg-sakura-deep text-white border-none font-sans text-[0.9375rem] tracking-[0.15em] cursor-pointer hover:bg-sakura hover:-translate-y-0.5 transition-all duration-300"
              >
                送信する
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
