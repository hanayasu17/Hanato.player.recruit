import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import type { PostCard } from "@/types/blog";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ post }: { post: PostCard }) {
  return (
    <article className="bg-white border border-black/5 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
      <Link href={`/blog/${post.slug.current}`} className="no-underline">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-sakura to-sakura-deep relative overflow-hidden">
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).width(600).height(340).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white font-serif text-xl">
              花人
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map((cat) => (
                <span
                  key={cat._id}
                  className="text-xs tracking-wide text-sakura-deep bg-sakura/15 px-2 py-0.5"
                >
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-serif text-lg font-semibold mb-2 text-ink leading-snug group-hover:text-sakura-deep transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-warmgray mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <time className="text-xs text-warmgray">
              {formatDate(post.publishedAt)}
            </time>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag._id}
                    className="text-xs text-warmgray"
                  >
                    #{tag.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
