import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-6xl font-semibold text-sakura mb-6">
        404
      </h1>
      <p className="text-xl text-ink mb-4">
        ページが見つかりませんでした
      </p>
      <p className="text-warmgray mb-8">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-3 bg-ink text-paper no-underline text-sm tracking-[0.15em] hover:bg-sakura-deep transition-colors duration-300"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
