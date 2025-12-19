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
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              type: "text",
              title: "Description",
              description: "Preview text shown in the service box (truncated to 2 lines)",
            },
            {
              name: "slug",
              type: "slug",
              title: "URL Slug",
              description: "URL-friendly identifier for this service (e.g., 'plumbing-services')",
              options: {
                source: "title",
                maxLength: 96,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "fullDescription",
              type: "array",
              title: "Full Description",
              description: "Rich text content displayed on the service detail page",
              of: [
                {
                  type: "block",
                },
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alternative Text",
                    },
                  ],
                },
              ],
            },
            {
              name: "images",
              type: "array",
              title: "Images",
              description: "Additional images for the service detail page",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alternative Text",
                    },
                    {
                      name: "caption",
                      type: "string",
                      title: "Caption",
                    },
                  ],
                },
              ],
            },
            {
              name: "features",
              type: "array",
              title: "Features",
              description: "List of key features or benefits for this service",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "title",
                      type: "string",
                      title: "Feature Title",
                    },
                    {
                      name: "description",
                      type: "text",
                      title: "Feature Description",
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
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
