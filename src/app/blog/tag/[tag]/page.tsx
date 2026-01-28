import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import { getPostsByTag, getAllTagSlugs } from "@/lib/queries";

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllTagSlugs();
    return slugs.map((tag) => ({ tag }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  try {
    const { tag: tagSlug } = await params;
    const { tag } = await getPostsByTag(tagSlug);
    if (!tag) return { title: "タグが見つかりません" };

    return {
      title: `#${tag.title}の記事一覧`,
      description: `花人ブログの「#${tag.title}」タグの記事一覧です。`,
    };
  } catch {
    return { title: "タグ" };
  }
}

async function TagContent({ params, searchParams }: TagPageProps) {
  const [{ tag: tagSlug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const currentPage = Number(resolvedSearchParams.page) || 1;
  const postsPerPage = 9;

  let posts: import("@/types/blog").PostCard[] = [];
  let total = 0;
  let tag: import("@/types/blog").Tag | null = null;

  try {
    const result = await getPostsByTag(
      tagSlug,
      (currentPage - 1) * postsPerPage,
      postsPerPage
    );
    posts = result.posts;
    total = result.total;
    tag = result.tag;
  } catch {
    notFound();
  }

  if (!tag) notFound();

  const totalPages = Math.ceil(total / postsPerPage);

  return (
    <div className="py-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-warmgray">
          <Link href="/" className="hover:text-ink no-underline text-warmgray">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/blog"
            className="hover:text-ink no-underline text-warmgray"
          >
            ブログ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">#{tag.title}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-warmgray mb-6 block">
            TAG
          </span>
          <h1
            className="font-serif font-semibold mb-4"
            style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
          >
            #{tag.title}
          </h1>
          <p className="text-sm text-warmgray">{total}件の記事</p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-warmgray text-lg">
              このタグにはまだ記事がありません。
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/blog/tag/${tagSlug}`}
        />

        {/* Back to blog */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="text-sm text-warmgray no-underline hover:text-ink transition-colors duration-300"
          >
            ← ブログ一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TagPage(props: TagPageProps) {
  return (
    <Suspense
      fallback={
        <div className="py-32 text-center">
          <p className="text-warmgray">読み込み中...</p>
        </div>
      }
    >
      <TagContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}
