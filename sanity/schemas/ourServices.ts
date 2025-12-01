import { defineType } from "sanity";

export default defineType({
  name: "ourServices",
  title: "Our Services Page",
  type: "document",
  fields: [
    {
      name: "sectionTitle",
      type: "string",
      title: "Section Title",
    },
    {
      name: "descriptionText",
      type: "text",
      title: "Description Text",
    },
    {
      name: "servicesInfo",
      title: "Service Info Boxes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
              name: "description",
              type: "text",
              title: "Description",
            },
          ],
        },
      ],
    },
    {
      name: "services",
      title: "CardSwap Images",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
              name: "description",
              type: "text",
              title: "Description",
            },
            {
              name: "image",
              type: "image",
              title: "Card Image",
              options: { hotspot: true }, // IMPORTANT FIX
            },
          ],
        },
      ],
    },
  ],
});
