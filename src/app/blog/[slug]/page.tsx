import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import {
  getPostBySlug,
  getRelatedPosts,
  getAllPostSlugs,
} from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import ShareButtons from "@/components/ShareButtons";
import TableOfContents from "@/components/TableOfContents";
import BlogCard from "@/components/BlogCard";
import type { SanityImage } from "@/types/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "記事が見つかりません" };

    const ogImage = post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : undefined;

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        images: ogImage ? [{ url: ogImage }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return { title: "ブログ" };
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const portableTextComponents = {
  types: {
    image: ({
      value,
    }: {
      value: SanityImage & { caption?: string };
    }) => (
      <figure className="my-8">
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || ""}
          width={800}
          height={450}
          className="w-full h-auto rounded-lg"
        />
        {value.caption && (
          <figcaption className="text-center text-sm text-warmgray mt-2">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { href?: string };
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sakura-deep underline underline-offset-2 hover:text-sakura"
      >
        {children}
      </a>
    ),
  },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  let relatedPosts: import("@/types/blog").PostCard[] = [];
  try {
    const categoryIds = post.categories?.map((c) => c._id) || [];
    relatedPosts = await getRelatedPosts(post._id, categoryIds);
  } catch {
    // Sanity not available
  }

  const postUrl = `https://hanato.jp/blog/${slug}`;

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: post.author
              ? {
                  "@type": "Person",
                  name: post.author.name,
                }
              : undefined,
            publisher: {
              "@type": "Organization",
              name: "花人-Hanato-",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": postUrl,
            },
            image: post.mainImage
              ? urlFor(post.mainImage).width(1200).height(630).url()
              : undefined,
          }),
        }}
      />

      <article className="py-16 px-6">
        <div className="max-w-[900px] mx-auto">
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
            <span className="text-ink">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/blog/category/${cat.slug.current}`}
                    className="text-xs tracking-wide text-sakura-deep bg-sakura/15 px-3 py-1 no-underline hover:bg-sakura/25 transition-colors duration-300"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-warmgray mb-6">
              <time>公開: {formatDate(post.publishedAt)}</time>
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <time>更新: {formatDate(post.updatedAt)}</time>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag._id}
                    href={`/blog/tag/${tag.slug.current}`}
                    className="text-xs text-warmgray no-underline hover:text-sakura-deep transition-colors duration-300"
                  >
                    #{tag.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Main Image */}
            {post.mainImage && (
              <div className="aspect-video relative overflow-hidden mb-8">
                <Image
                  src={urlFor(post.mainImage).width(900).height(500).url()}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Share Buttons (top) */}
            <ShareButtons url={postUrl} title={post.title} />
          </header>

          {/* Table of Contents */}
          <div className="mb-12">
            <TableOfContents />
          </div>

          {/* Body */}
          <div className="prose max-w-none mb-16">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>

          {/* Share Buttons (bottom) */}
          <div className="border-t border-black/10 pt-8 mb-16">
            <ShareButtons url={postUrl} title={post.title} />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-8">
                関連記事
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relPost) => (
                  <BlogCard key={relPost._id} post={relPost} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
