export default {
  name: "author",
  title: "著者",
  type: "document",
  fields: [
    {
      name: "name",
      title: "名前",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "image",
      title: "画像",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "bio",
      title: "自己紹介",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
};
