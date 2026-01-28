import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "ブログ記事",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "タイトル",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "著者",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "mainImage",
      title: "メイン画像",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "代替テキスト",
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "カテゴリー",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "tags",
      title: "タグ",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "公開日",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "抜粋",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "body",
      title: "本文",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return {
        ...selection,
        subtitle: author ? `by ${author}` : "",
      };
    },
  },
});
