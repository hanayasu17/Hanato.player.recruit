export default {
  name: "post",
  title: "ブログ記事",
  type: "document",
  fields: [
    {
      name: "title",
      title: "タイトル",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "スラッグ",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "author",
      title: "著者",
      type: "reference",
      to: [{ type: "author" }],
    },
    {
      name: "mainImage",
      title: "メイン画像",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "代替テキスト",
        },
      ],
    },
    {
      name: "categories",
      title: "カテゴリー",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    {
      name: "tags",
      title: "タグ",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    {
      name: "publishedAt",
      title: "公開日",
      type: "datetime",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "抜粋",
      type: "text",
      rows: 3,
      validation: (Rule: { required: () => { max: (n: number) => unknown } }) =>
        Rule.required().max(200),
    },
    {
      name: "body",
      title: "本文",
      type: "blockContent",
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection: { title: string; author: string; media: unknown }) {
      const { author } = selection;
      return {
        ...selection,
        subtitle: author ? `by ${author}` : "",
      };
    },
  },
};
