import type { MetadataRoute } from "next";
import {
  getAllPostSlugs,
  getAllCategorySlugs,
  getAllTagSlugs,
} from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://hanato.jp";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    // Blog posts
    const postSlugs = await getAllPostSlugs();
    const postPages: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Categories
    const categorySlugs = await getAllCategorySlugs();
    const categoryPages: MetadataRoute.Sitemap = categorySlugs.map(
      (slug) => ({
        url: `${baseUrl}/blog/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })
    );

    // Tags
    const tagSlugs = await getAllTagSlugs();
    const tagPages: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({
      url: `${baseUrl}/blog/tag/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));

    return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
  } catch {
    return staticPages;
  }
}
