export default {
  name: "tag",
  title: "タグ",
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
  ],
};
