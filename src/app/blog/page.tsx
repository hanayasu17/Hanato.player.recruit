import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { getPosts, getCategories, getTags, searchPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "ブログ",
  description:
    "花人（Hanato）のブログ。健康、情報、希望、創造にまつわる記事をお届けします。",
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.q || "";
  const postsPerPage = 9;

  let posts: import("@/types/blog").PostCard[] = [];
  let total = 0;
  let categories: import("@/types/blog").Category[] = [];
  let tags: import("@/types/blog").Tag[] = [];

  try {
    if (searchQuery) {
      const searchResults = await searchPosts(searchQuery);
      posts = searchResults;
      total = searchResults.length;
    } else {
      const result = await getPosts(
        (currentPage - 1) * postsPerPage,
        postsPerPage
      );
      posts = result.posts;
      total = result.total;
    }

    [categories, tags] = await Promise.all([getCategories(), getTags()]);
  } catch {
    // Sanity not available
  }

  const totalPages = Math.ceil(total / postsPerPage);

  return (
    <>
      {/* Search & Filters */}
      <div className="mb-12">
        <SearchBox />
      </div>

      {searchQuery && (
        <div className="mb-8">
          <p className="text-warmgray text-sm">
            「{searchQuery}」の検索結果: {total}件
          </p>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="px-4 py-2 text-xs tracking-wide border border-black/10 text-ink no-underline hover:bg-ink hover:text-paper transition-all duration-300"
            >
              すべて
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/blog/category/${cat.slug.current}`}
                className="px-4 py-2 text-xs tracking-wide border border-black/10 text-warmgray no-underline hover:bg-ink hover:text-paper transition-all duration-300"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                href={`/blog/tag/${tag.slug.current}`}
                className="text-xs text-warmgray no-underline hover:text-sakura-deep transition-colors duration-300"
              >
                #{tag.title}
              </Link>
            ))}
          </div>
        </div>
      )}

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
            {searchQuery
              ? "検索結果が見つかりませんでした。"
              : "まだ記事がありません。"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!searchQuery && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/blog"
        />
      )}
    </>
  );
}

export default function BlogPage(props: BlogPageProps) {
  return (
    <div className="py-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] text-warmgray mb-6 block">
            BLOG
          </span>
          <h1
            className="font-serif font-semibold"
            style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
          >
            ブログ
          </h1>
          <p className="text-warmgray mt-4">
            花人の活動や想いを綴った記事をお届けします。
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-20">
              <p className="text-warmgray">読み込み中...</p>
            </div>
          }
        >
          <BlogContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
