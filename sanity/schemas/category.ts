export default {
  name: "category",
  title: "カテゴリー",
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
      name: "description",
      title: "説明",
      type: "text",
    },
  ],
};
