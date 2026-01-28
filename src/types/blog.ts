import type { PortableTextBlock } from "@portabletext/react";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Tag {
  _id: string;
  title: string;
  slug: { current: string };
}

export interface Author {
  _id: string;
  name: string;
  image?: SanityImage;
  bio?: PortableTextBlock[];
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  updatedAt?: string;
  excerpt: string;
  mainImage?: SanityImage;
  body: PortableTextBlock[];
  categories: Category[];
  tags: Tag[];
  author?: Author;
}

export interface PostCard {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  mainImage?: SanityImage;
  categories: Category[];
  tags: Tag[];
}
