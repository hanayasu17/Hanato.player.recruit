import { client } from "./sanity";
import type { Post, PostCard, Category, Tag } from "@/types/blog";

// Get all posts with pagination
export async function getPosts(
  start = 0,
  limit = 9
): Promise<{ posts: PostCard[]; total: number }> {
  const posts = await client.fetch<PostCard[]>(
    `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [${start}...${start + limit}] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      "categories": categories[]->{_id, title, slug},
      "tags": tags[]->{_id, title, slug}
    }`
  );

  const total = await client.fetch<number>(
    `count(*[_type == "post" && !(_id in path("drafts.**"))])`
  );

  return { posts, total };
}

// Get latest posts for homepage
export async function getLatestPosts(limit = 5): Promise<PostCard[]> {
  return client.fetch<PostCard[]>(
    `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      "categories": categories[]->{_id, title, slug},
      "tags": tags[]->{_id, title, slug}
    }`
  );
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id,
      title,
      slug,
      publishedAt,
      "updatedAt": _updatedAt,
      excerpt,
      mainImage,
      body,
      "categories": categories[]->{_id, title, slug},
      "tags": tags[]->{_id, title, slug},
      "author": author->{_id, name, image, bio}
    }`,
    { slug }
  );
  return post;
}

// Get related posts
export async function getRelatedPosts(
  postId: string,
  categoryIds: string[],
  limit = 3
): Promise<PostCard[]> {
  return client.fetch<PostCard[]>(
    `*[_type == "post" && _id != $postId && count(categories[@._ref in $categoryIds]) > 0 && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      "categories": categories[]->{_id, title, slug},
      "tags": tags[]->{_id, title, slug}
    }`,
    { postId, categoryIds }
  );
}

// Get posts by category
export async function getPostsByCategory(
  categorySlug: string,
  start = 0,
  limit = 9
): Promise<{ posts: PostCard[]; total: number; category: Category | null }> {
  const category = await client.fetch<Category | null>(
    `*[_type == "category" && slug.current == $categorySlug][0]{_id, title, slug, description}`,
    { categorySlug }
  );

  if (!category) return { posts: [], total: 0, category: null };

  const posts = await client.fetch<PostCard[]>(
    `*[_type == "post" && $categoryId in categories[]._ref && !(_id in path("drafts.**"))] | order(publishedAt desc) [${start}...${start + limit}] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      "categories": categories[]->{_id, title, slug},
      "tags": tags[]->{_id, title, slug}
    }`,
    { categoryId: category._id }
  );

  const total = await client.fetch<number>(
    `count(*[_type == "post" && $categoryId in categories[]._ref && !(_id in path("drafts.**"))])`,
    { categoryId: category._id }
  );

  return { posts, total, category };
}

// Get posts by tag
export async function getPostsByTag(
  tagSlug: string,
  start = 0,
  limit = 9
): Promise<{ posts: PostCard[]; total: number; tag: Tag | null }> {
  const tag = await client.fetch<Tag | null>(
    `*[_type == "tag" && slug.current == $tagSlug][0]{_id, title, slug}`,
    { tagSlug }
  );

  if (!tag) return { posts: [], total: 0, tag: null };

  const posts = await client.fetch<PostCard[]>(
    `*[_type == "post" && $tagId in tags[]._ref && !(_id in path("drafts.**"))] | order(publishedAt desc) [${start}...${start + limit}] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      "categories": categories[]->{_id, title, slug},
      "tags": tags[]->{_id, title, slug}
    }`,
    { tagId: tag._id }
  );

  const total = await client.fetch<number>(
    `count(*[_type == "post" && $tagId in tags[]._ref && !(_id in path("drafts.**"))])`,
    { tagId: tag._id }
  );

  return { posts, total, tag };
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  return client.fetch<Category[]>(
    `*[_type == "category"] | order(title asc) {_id, title, slug, description}`
  );
}

// Get all tags
export async function getTags(): Promise<Tag[]> {
  return client.fetch<Tag[]>(
    `*[_type == "tag"] | order(title asc) {_id, title, slug}`
  );
}

// Search posts
export async function searchPosts(query: string): Promise<PostCard[]> {
  return client.fetch<PostCard[]>(
    `*[_type == "post" && !(_id in path("drafts.**")) && (title match $searchTerm || excerpt match $searchTerm || pt::text(body) match $searchTerm)] | order(publishedAt desc) [0...20] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      "categories": categories[]->{_id, title, slug},
      "tags": tags[]->{_id, title, slug}
    }`,
    { searchTerm: `${query}*` }
  );
}

// Get all post slugs for static generation
export async function getAllPostSlugs(): Promise<string[]> {
  const slugs = await client.fetch<{ current: string }[]>(
    `*[_type == "post" && !(_id in path("drafts.**"))].slug`
  );
  return slugs.map((s) => s.current);
}

// Get all category slugs
export async function getAllCategorySlugs(): Promise<string[]> {
  const slugs = await client.fetch<{ current: string }[]>(
    `*[_type == "category"].slug`
  );
  return slugs.map((s) => s.current);
}

// Get all tag slugs
export async function getAllTagSlugs(): Promise<string[]> {
  const slugs = await client.fetch<{ current: string }[]>(
    `*[_type == "tag"].slug`
  );
  return slugs.map((s) => s.current);
}
