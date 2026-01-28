import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImage } from "@/types/blog";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// Use a valid placeholder project ID for build time when not configured
const safeProjectId =
  projectId && /^[a-z0-9-]+$/.test(projectId) ? projectId : "placeholder";

export const isSanityConfigured =
  !!projectId && projectId !== "your_project_id" && /^[a-z0-9-]+$/.test(projectId);

export const client = createClient({
  projectId: safeProjectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImage) {
  return builder.image(source);
}
