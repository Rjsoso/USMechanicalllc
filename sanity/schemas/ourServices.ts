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
      description: "Static title (used if rotatingText is empty)",
    },
    {
      name: "rotatingText",
      type: "array",
      title: "Rotating Text",
      description: "Array of text strings that will rotate in the title. Leave empty to use static sectionTitle.",
      of: [{ type: "string" }],
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
